import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves scoped report generation and export retain the requested report type. */
export async function test_api_reports(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-report`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `Report ${suffix}`, code: `report-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("report membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const trial = await api.functional.organization.report.trial_balance.trial(owner, {}); typia.assert(trial);
  const headcount = await api.functional.organization.report.headcount(owner, {}); if (headcount.report_type !== "headcount") throw new Error("headcount report type was not retained");
  const exported = await api.functional.organization.report._export(owner, "trial-balance", {}); if (exported.report_type !== "trial-balance") throw new Error("report export type was not retained");
}
