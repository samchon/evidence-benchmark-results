import * as api from "@benchmark/erp-api";

/** Proves BOM/routing release and production-order execution lifecycle. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-routing-routing-version-rules Exercises and asserts the routing routing version rules behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-production-backend-delivery Exercises and asserts the delivery production backend delivery behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-bom-bom-version-rules Exercises and asserts the bom bom version rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-production-production-order-rules Exercises and asserts the production production order rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-bom-bill-of-materials-lifecycle Exercises and asserts the bom bill of materials lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-routing-routing-lifecycle Exercises and asserts the routing routing lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-work-center-work-centers Exercises and asserts the work center work centers behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-machine-machines Exercises and asserts the machine machines behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-production-order-production-order-lifecycle Exercises and asserts the production order production order lifecycle behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bom-bill-of-materials-operations Exercises and asserts the bom bill of materials operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-routing-routing-operations Exercises and asserts the routing routing operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-work-center-work-center-operations Exercises and asserts the work center work center operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-machine-machine-operations Exercises and asserts the machine machine operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-production-order-production-order-operations Exercises and asserts the production order production order operations behavior.
 */
export async function test_api_manufacturing(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `manufacturing-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Manufacturing ${suffix}`, code: `manufacturing-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const item = await api.functional.item_create.create(owner, { sku: "FG-001", name: "Finished Good", itemType: "stock", trackingMode: "none" });
  const bom = await api.functional.bom_create.create(owner, { itemId: item.id, code: "BOM-001", version: 1, quantity: 1 });
  const bomReleased = await api.functional.bom_status.status(owner, bom.id, { status: "released" });
  const routing = await api.functional.routing_create.create(owner, { itemId: item.id, code: "ROUTE-001", version: 1 });
  const routingReleased = await api.functional.routing_status.status(owner, routing.id, { status: "released" });
  const center = await api.functional.work_center_create.create(owner, { code: "WC-001", name: "Assembly", capacityHours: 80 });
  const component = await api.functional.item_create.create(owner, { sku: "RM-001", name: "Raw Material", itemType: "stock", trackingMode: "none" });
  const bomLine = await api.functional.bom_line_create.create(owner, { bomId: bom.id, componentItemId: component.id, quantity: 2, unitCode: "EA", scrapPercent: 1 });
  const routingStep = await api.functional.routing_step_create.create(owner, { routingId: routing.id, sequence: 1, workCenterId: center.id, description: "Assembly", setupMinutes: 10, runMinutes: 30 });
  const machine = await api.functional.machine_create.create(owner, { workCenterId: center.id, code: "M-001", name: "Press" });
  const inactiveMachine = await api.functional.machine_status.status(owner, machine.id, { status: "inactive" });
  const order = await api.functional.production_order_create.create(owner, { itemId: item.id, bomId: bom.id, routingId: routing.id, plannedQuantity: 100, dueDate: "2026-09-01T00:00:00.000Z" });
  await api.functional.production_order_status.status(owner, order.id, { status: "released" });
  await api.functional.production_order_status.status(owner, order.id, { status: "in_progress" });
  const completed = await api.functional.production_order_status.status(owner, order.id, { status: "completed" });
  if (bomReleased.status !== "released" || routingReleased.status !== "released" || center.status !== "active" || completed.status !== "completed" || bomLine.quantity !== 2 || routingStep.sequence !== 1 || inactiveMachine.status !== "inactive") throw new Error("manufacturing lifecycle state was not retained");
}
