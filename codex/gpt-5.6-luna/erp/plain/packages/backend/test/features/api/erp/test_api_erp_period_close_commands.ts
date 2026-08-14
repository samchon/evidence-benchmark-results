import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves fiscal close snapshot reproduction and reasoned reopen approval. */
export async function test_api_erp_period_close_commands(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const period = await api.functional.erp.control_ops.period.periodCreate(owner.connection, { name: `CLOSE-${Date.now()}`, startsAt: "2027-01-01T00:00:00.000Z", endsAt: "2027-12-31T23:59:59.999Z" });
  const soft = await api.functional.erp.control_ops.period.soft_close.periodSoftClose(owner.connection, period.id);
  const hard = await api.functional.erp.control_ops.period.hard_close.periodHardClose(owner.connection, soft.id);
  const snapshot = await api.functional.erp.control_ops.period.snapshot.periodSnapshot(owner.connection, hard.id, "trial_balance");
  if (snapshot.periodId !== hard.id || snapshot.kind !== "trial_balance" || snapshot.closeCycle !== hard.closeCycle) throw new Error("Fiscal closing snapshot was not reproducible for the active close cycle.");
  const request = await api.functional.erp.control_ops.period.reopen_request.periodReopenRequest(owner.connection, hard.id, { reason: "Correct a retained closing adjustment." });
  const approved = await api.functional.erp.control_ops.approval.approvalResolve(owner.connection, request.id, "approved", { reason: "Owner approved the correction." });
  if (approved.status !== "approved") throw new Error("Fiscal period reopen approval was not resolved.");
  const periods = await api.functional.erp.control_ops.period.periodIndex(owner.connection, { page: 1, limit: 20 });
  const reopened = periods.data.find((row) => row.id === hard.id);
  if (reopened?.status !== "reopened") throw new Error("Approved fiscal period reopen did not change period state.");
  const reclosedSoft = await api.functional.erp.control_ops.period.soft_close.periodSoftClose(owner.connection, hard.id);
  const reclosedHard = await api.functional.erp.control_ops.period.hard_close.periodHardClose(owner.connection, reclosedSoft.id);
  const secondSnapshot = await api.functional.erp.control_ops.period.snapshot.periodSnapshot(owner.connection, reclosedHard.id, "trial_balance");
  if (reclosedHard.closeCycle !== 2 || secondSnapshot.closeCycle !== 2) throw new Error("Fiscal period reclose did not preserve a new close cycle.");
}

/** Proves overlapping fiscal periods are rejected even when their names share a fiscal year. */
export async function test_api_erp_period_overlap_rejected(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  await api.functional.erp.control_ops.period.periodCreate(owner.connection, { name: "FY-2027", startsAt: "2027-01-01T00:00:00.000Z", endsAt: "2027-06-30T23:59:59.999Z" });
  let rejected = false;
  try {
    await api.functional.erp.control_ops.period.periodCreate(owner.connection, { name: `FY-2027`, startsAt: "2027-06-01T00:00:00.000Z", endsAt: "2027-12-31T23:59:59.999Z" });
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error("Overlapping fiscal periods were accepted.");
}
