import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves quality inspection, quarantine release, and service-order completion. */
export async function test_api_quality_service(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-qms`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `QMS ${suffix}`, code: `qms-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("QMS membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const unit = await api.functional.organization.unit.createUnit(owner, { code: "EA", name: "Each", category: "quantity" });
  const item = await api.functional.organization.item.createItem(owner, { sku: `Q-${suffix}`, name: "Sample", item_type: "inventory", unit_id: unit.id });
  const warehouse = await api.functional.organization.warehouse.createWarehouse(owner, { code: `W-${suffix}`, name: "Main" });
  const inspection = await api.functional.organization.quality_inspection.createInspection(owner, { item_id: item.id, inspected_quantity: 3 });
  const passed = await api.functional.organization.quality_inspection.complete.completeInspection(owner, inspection.id, { result: "passed", status: "passed" }); if (passed.status !== "passed") throw new Error("inspection did not pass");
  const quarantine = await api.functional.organization.quarantine.createQuarantine(owner, { item_id: item.id, warehouse_id: warehouse.id, quantity: 1, reason: "inspection hold" });
  const released = await api.functional.organization.quarantine.release.releaseQuarantine(owner, quarantine.id, { status: "released", disposition: "return" }); if (released.status !== "released") throw new Error("quarantine did not release");
  const customer = await api.functional.organization.customer.createCustomer(owner, { name: `Customer ${suffix}` });
  const service = await api.functional.organization.service_order.createServiceOrder(owner, { customer_id: customer.id, title: "Repair", billable: true });
  const completed = await api.functional.organization.service_order.complete.completeServiceOrder(owner, service.id); typia.assert(completed); if (completed.status !== "completed") throw new Error("service order did not complete");
}
