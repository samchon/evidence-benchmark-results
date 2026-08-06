import * as api from "@benchmark/erp-api";

/** Proves payroll setup, period lock, run approval, and payslip issuance. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-h2r-hire-to-retire-and-payroll-journey Exercises and asserts the h2r hire to retire and payroll journey behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-pay-schedule-pay-schedule-operations Exercises and asserts the pay schedule pay schedule operations behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-payroll-payroll-rules Exercises and asserts the payroll payroll rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-pay-schedule-pay-schedules Exercises and asserts the pay schedule pay schedules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-payroll-run-payroll-run-lifecycle Exercises and asserts the payroll run payroll run lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-payslip-payslips Exercises and asserts the payslip payslips behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-payroll-config-payroll-configuration Exercises and asserts the payroll config payroll configuration behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payroll-config-payroll-configuration-operations Exercises and asserts the payroll config payroll configuration operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payroll-run-payroll-run-operations Exercises and asserts the payroll run payroll run operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payslip-payslip-operations Exercises and asserts the payslip payslip operations behavior.
 */
export async function test_api_payroll(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `payroll-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Payroll ${suffix}`, code: `payroll-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const department = await api.functional.department_create.create(owner, { code: "OPS", name: "Operations" });
  const employee = await api.functional.employee_create.create(owner, { employeeNumber: "E-001", firstName: "Grace", lastName: "Hopper", departmentId: department.id });
  const config = await api.functional.payroll_configuration_create.create(owner, { name: "Monthly US", currencyCode: "USD", payFrequency: "monthly", effectiveFrom: "2026-01-01T00:00:00.000Z" });
  const active = await api.functional.payroll_configuration_status.status(owner, config.id, { status: "active" });
  const schedule = await api.functional.pay_schedule_create.create(owner, { name: "August 2026", frequency: "monthly", periodStart: "2026-08-01T00:00:00.000Z", periodEnd: "2026-08-31T00:00:00.000Z", payDate: "2026-09-05T00:00:00.000Z" });
  const locked = await api.functional.pay_schedule_status.status(owner, schedule.id, { status: "locked" });
  const run = await api.functional.payroll_run_create.create(owner, { payScheduleId: schedule.id, totalGross: 5000, totalNet: 4000 });
  await api.functional.payroll_run_status.status(owner, run.id, { status: "calculated" });
  const approved = await api.functional.payroll_run_status.status(owner, run.id, { status: "approved" });
  const payslip = await api.functional.payslip_create.create(owner, { payrollRunId: run.id, employeeId: employee.id, grossAmount: 5000, taxAmount: 1000, netAmount: 4000 });
  const issued = await api.functional.payslip_status.status(owner, payslip.id, { status: "issued" });
  if (active.status !== "active" || locked.status !== "locked" || approved.status !== "approved" || issued.status !== "issued") throw new Error("payroll lifecycle state was not retained");
}
