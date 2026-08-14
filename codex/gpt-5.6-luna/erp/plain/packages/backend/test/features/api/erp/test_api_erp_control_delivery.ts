import * as api from "@benchmark/erp-api";
import { MyGlobal } from "../../../../src/MyGlobal";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves high-risk party changes queue, dispatch, and retry recipient-scoped notifications. */
export async function test_api_erp_notification_delivery(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const vendor = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: `Notification Vendor ${Date.now()}`, currency: "USD" });
  const request = await api.functional.erp.party.change_request.partyChangeCreate(owner.connection, vendor.id, { kind: "bank_account", proposedValue: "****1122", reason: "Verified" });
  await api.functional.erp.party.change_request.transition.partyChangeResolve(owner.connection, request.id, "approved");
  const queued = await api.functional.erp.control_ops.notification.notificationIndex(owner.connection, { page: 1, limit: 20 });
  const notification = queued.data.find((row) => row.kind === "high-risk-audit");
  if (notification === undefined || notification.status !== "queued" || notification.sourceId === null || notification.attempts !== 0) throw new Error("High-risk audit did not queue a durable, source-linked owner notification.");
  const sent = await api.functional.erp.control_ops.notification.dispatch.notificationDispatch(owner.connection, notification.id);
  if (sent.status !== "sent" || sent.attempts !== 1 || sent.sentAt === null) throw new Error("Queued notification did not record its delivery attempt and result.");
  await MyGlobal.prisma.notifications.update({ where: { id: notification.id }, data: { status: "failed" } });
  const retried = await api.functional.erp.control_ops.notification.retry.notificationRetry(owner.connection, notification.id);
  if (retried.status !== "queued" || retried.attempts !== 1 || retried.lastError !== null) throw new Error("Failed notification retry did not preserve attempt history or clear the retry state.");
}

/** Proves an export keeps the same authoritative report scope and filters as the on-screen report. */
export async function test_api_erp_report_export(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const input: api.IReport.IRequest = { kind: "inventory", from: "2026-01-01T00:00:00.000Z", to: "2026-12-31T23:59:59.000Z" };
  const screen = await api.functional.erp.control.report.report(owner.connection, input);
  const exported = await api.functional.erp.control.report._export.reportExport(owner.connection, input);
  if (exported.organizationId !== screen.organizationId || exported.filters !== screen.filters || exported.rows.length !== screen.rows.length) throw new Error("Report export did not preserve the report scope and filters.");
}
