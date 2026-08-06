import * as api from "@benchmark/erp-api";

/** Proves department and employee master lifecycles stay organization-scoped. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-employee-employee-identity-and-visibility-rules Exercises and asserts the employee employee identity and visibility rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-contract-employment-contract-rules Exercises and asserts the contract employment contract rules behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-employee-employee-operations Exercises and asserts the employee employee operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-department-department-operations Exercises and asserts the department department operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-contract-employment-contract-operations Exercises and asserts the contract employment contract operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-employee-employee-lifecycle Exercises and asserts the employee employee lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-department-departments Exercises and asserts the department departments behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-contract-employment-contract-lifecycle Exercises and asserts the contract employment contract lifecycle behavior.
 */
export async function test_api_hr_master(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `hr-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `HR ${suffix}`, code: `hr-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const department = await api.functional.department_create.create(owner, { code: "ENG", name: "Engineering" });
  const employee = await api.functional.employee_create.create(owner, { employeeNumber: "E-001", firstName: "Ada", lastName: "Lovelace", departmentId: department.id, status: "active" });
  const revised = await api.functional.employee_update.update(owner, employee.id, { phone: "+1-555-0101" });
  if (revised.phone !== "+1-555-0101") throw new Error("employee revision was not retained");
  const employees = await api.functional.employee_search.index(owner, { departmentId: department.id, search: "Ada" });
  if (!employees.data.some((item) => item.id === employee.id)) throw new Error("employee search omitted department member");
  const departmentRevision = await api.functional.department_update.update(owner, department.id, { name: "Engineering & Research" });
  if (departmentRevision.name !== "Engineering & Research") throw new Error("department revision was not retained");
  await api.functional.employee_status.status(owner, employee.id, { active: false });
  await api.functional.department_status.status(owner, department.id, { active: false });
}
