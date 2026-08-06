import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves payroll, payslip issuance, fixed-asset accounting, and maintenance lifecycle. */
export async function test_api_hr_assets(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-hr`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `HR ${suffix}`, code: `hr-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("HR membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const employee = await api.functional.organization.employee.createEmployee(owner, { employee_number: `E-${suffix}`, first_name: "Grace", last_name: "Hopper" });
  const run = await api.functional.organization.payroll_run.createRun(owner, { period_start: "2026-01-01T00:00:00.000Z", period_end: "2026-01-31T00:00:00.000Z" }); typia.assert(run);
  await api.functional.organization.payroll_run.calculate.calculateRun(owner, run.id);
  await api.functional.organization.payroll_run.approve.approveRun(owner, run.id);
  const postedRun = await api.functional.organization.payroll_run.post.postRun(owner, run.id); if (postedRun.status !== "posted") throw new Error("payroll run did not post");
  const slip = await api.functional.organization.payslip.createSlip(owner, { payroll_run_id: run.id, employee_id: employee.id, gross: 1000, deductions: 100 });
  const issued = await api.functional.organization.payslip.issue.issueSlip(owner, slip.id); if (issued.status !== "issued" || issued.net !== 900) throw new Error("payslip did not issue expected net");
  const asset = await api.functional.organization.fixed_asset.createAsset(owner, { name: "Laptop", cost: 1200 });
  await api.functional.organization.fixed_asset.capitalize.capitalizeAsset(owner, asset.id);
  await api.functional.organization.fixed_asset.depreciate.depreciateAsset(owner, asset.id, { amount: 100 });
  const disposed = await api.functional.organization.fixed_asset.dispose.disposeAsset(owner, asset.id); if (disposed.status !== "disposed") throw new Error("fixed asset did not dispose");
  const maintenance = await api.functional.organization.maintenance_order.createMaintenance(owner, { asset_id: asset.id, title: "Replace battery" });
  const completed = await api.functional.organization.maintenance_order.complete.completeMaintenance(owner, maintenance.id); if (completed.status !== "completed") throw new Error("maintenance order did not complete");
}
