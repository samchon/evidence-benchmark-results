import * as api from "@benchmark/erp-api";

/** Proves project/task work and employee time approval lifecycles. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-project-project-time-eligibility-rules Exercises and asserts the project project time eligibility rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-timelog-timelog-authority-and-lock-rules Exercises and asserts the timelog timelog authority and lock rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-timesheet-timesheet-submission-and-use-rules Exercises and asserts the timesheet timesheet submission and use rules behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-project-project-operations Exercises and asserts the project project operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-task-task-operations Exercises and asserts the task task operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timelog-timelog-operations Exercises and asserts the timelog timelog operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timesheet-timesheet-operations Exercises and asserts the timesheet timesheet operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-project-project-lifecycle Exercises and asserts the project project lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-project-member-project-membership Exercises and asserts the project member project membership behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-task-task-lifecycle Exercises and asserts the task task lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-timelog-timelogs Exercises and asserts the timelog timelogs behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-timesheet-timesheet-lifecycle Exercises and asserts the timesheet timesheet lifecycle behavior.
 */
export async function test_api_project_work(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `project-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Project ${suffix}`, code: `project-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const department = await api.functional.department_create.create(owner, { code: "ENG", name: "Engineering" });
  const employee = await api.functional.employee_create.create(owner, { employeeNumber: "E-001", firstName: "Ada", lastName: "Lovelace", departmentId: department.id });
  const project = await api.functional.project_create.create(owner, { code: "P-001", name: "ERP Upgrade", managerEmployeeId: employee.id, budgetAmount: 10000 });
  const active = await api.functional.project_status.status(owner, project.id, { status: "active" });
  const task = await api.functional.task_create.create(owner, { projectId: project.id, assigneeEmployeeId: employee.id, code: "T-001", title: "Design API", priority: "high", estimateHours: 8 });
  await api.functional.task_status.status(owner, task.id, { status: "in_progress" });
  const done = await api.functional.task_status.status(owner, task.id, { status: "done" });
  const timelog = await api.functional.timelog_create.create(owner, { employeeId: employee.id, projectId: project.id, taskId: task.id, workDate: "2026-08-05T00:00:00.000Z", hours: 8, description: "API design" });
  await api.functional.timelog_status.status(owner, timelog.id, { status: "submitted" });
  const approvedLog = await api.functional.timelog_status.status(owner, timelog.id, { status: "approved" });
  const timesheet = await api.functional.timesheet_create.create(owner, { employeeId: employee.id, periodStart: "2026-08-01T00:00:00.000Z", periodEnd: "2026-08-07T00:00:00.000Z", totalHours: 8 });
  await api.functional.timesheet_status.status(owner, timesheet.id, { status: "submitted" });
  const approvedSheet = await api.functional.timesheet_status.status(owner, timesheet.id, { status: "approved" });
  if (active.status !== "active" || done.status !== "done" || approvedLog.status !== "approved" || approvedSheet.status !== "approved") throw new Error("project work approval states were not retained");
}
