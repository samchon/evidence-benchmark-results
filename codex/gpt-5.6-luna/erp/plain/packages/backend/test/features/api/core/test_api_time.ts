import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves timelog capture and weekly timesheet approval. */
export async function test_api_time(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-time`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `Time ${suffix}`, code: `time-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("time membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const employee = await api.functional.organization.employee.createEmployee(owner, { employee_number: `E-${suffix}`, first_name: "Lin", last_name: "Lee" });
  const log = await api.functional.organization.timelog.create(owner, { employee_id: employee.id, work_date: "2026-01-05T00:00:00.000Z", hours: 8, billable: true }); typia.assert(log);
  if (log.hours !== 8) throw new Error("timelog hours were not retained");
  const sheet = await api.functional.organization.timesheet.createSheet(owner, { employee_id: employee.id, week_start: "2026-01-05T00:00:00.000Z", total_hours: 8, lines_json: `[ {\"timelogId\":\"${log.id}\"} ]` });
  await api.functional.organization.timesheet.submit(owner, sheet.id);
  const approved = await api.functional.organization.timesheet.approve(owner, sheet.id); if (approved.status !== "approved") throw new Error("timesheet did not approve");
}
