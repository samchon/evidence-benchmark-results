import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves organization-scoped parties, item, warehouse, people, and project identities. */
export async function test_api_master_data(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-master`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `Master ${suffix}`, code: `master-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id);
  if (!membership) throw new Error("master-data membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const unit = await api.functional.organization.unit.createUnit(owner, { code: "EA", name: "Each", category: "quantity" });
  const vendor = await api.functional.organization.vendor.createVendor(owner, { name: `Vendor ${suffix}`, country_code: "KR" }); typia.assert(vendor);
  const customer = await api.functional.organization.customer.createCustomer(owner, { name: `Customer ${suffix}`, credit_limit: 10000 }); typia.assert(customer);
  const item = await api.functional.organization.item.createItem(owner, { sku: `SKU-${suffix}`, name: "Widget", item_type: "inventory", unit_id: unit.id, preferred_vendor_id: vendor.id, tracking_mode: "none" }); typia.assert(item);
  const warehouse = await api.functional.organization.warehouse.createWarehouse(owner, { code: `WH-${suffix}`, name: "Main", valuation_policy: "moving_average" }); typia.assert(warehouse);
  const location = await api.functional.organization.storage_location.createLocation(owner, { warehouse_id: warehouse.id, code: "A-01", name: "Aisle 1" }); typia.assert(location);
  const department = await api.functional.organization.department.createDepartment(owner, { code: `ENG-${suffix}`, name: "Engineering" }); typia.assert(department);
  const employee = await api.functional.organization.employee.createEmployee(owner, { employee_number: `E-${suffix}`, first_name: "Ada", last_name: "Lovelace", department_id: department.id }); typia.assert(employee);
  const project = await api.functional.organization.project.createProject(owner, { code: `P-${suffix}`, name: "Implementation" }); typia.assert(project);
  const task = await api.functional.organization.task.createTask(owner, { project_id: project.id, title: "Build master data", assignee_employee_id: employee.id }); typia.assert(task);
  const completed = await api.functional.organization.task.complete.completeTask(owner, task.id);
  if (completed.status !== "completed" || customer.name.length === 0 || location.warehouse_id !== warehouse.id || item.sku.length === 0) throw new Error("master-data lifecycle did not persist expected state");
}
