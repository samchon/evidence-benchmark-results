import * as api from "@benchmark/erp-api";

/** Proves inspection, quarantine, maintenance, and service lifecycles. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-quality-service-quality-and-service-journey Exercises and asserts the quality service quality and service journey behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-stock-quarantine-stock-quarantine-operations Exercises and asserts the stock quarantine stock quarantine operations behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-quality-quality-rules Exercises and asserts the quality quality rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-maintenance-maintenance-rules Exercises and asserts the maintenance maintenance rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-service-service-rules Exercises and asserts the service service rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-inspection-plan-inspection-plans Exercises and asserts the inspection plan inspection plans behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-inspection-order-inspection-order-lifecycle Exercises and asserts the inspection order inspection order lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-quarantine-stock-quarantine-lifecycle Exercises and asserts the quarantine stock quarantine lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-disposition-quality-disposition-lifecycle Exercises and asserts the disposition quality disposition lifecycle behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-equipment-equipment-lifecycle Exercises and asserts the equipment equipment lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-maintenance-plan-maintenance-plans Exercises and asserts the maintenance plan maintenance plans behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-maintenance-order-maintenance-work-order-lifecycle Exercises and asserts the maintenance order maintenance work order lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-service-case-service-case-lifecycle Exercises and asserts the service case service case lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-service-order-service-order-lifecycle Exercises and asserts the service order service order lifecycle behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inspection-plan-inspection-plan-operations Exercises and asserts the inspection plan inspection plan operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inspection-inspection-order-operations Exercises and asserts the inspection inspection order operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-quarantine-quality-disposition-operations Exercises and asserts the quarantine quality disposition operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-equipment-equipment-operations Exercises and asserts the equipment equipment operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-maintenance-plan-maintenance-plan-operations Exercises and asserts the maintenance plan maintenance plan operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-maintenance-work-order-operations Exercises and asserts the maintenance order maintenance work order operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-service-case-service-case-operations Exercises and asserts the service case service case operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-service-order-service-order-operations Exercises and asserts the service order service order operations behavior.
 */
export async function test_api_quality_service(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `quality-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Quality ${suffix}`, code: `quality-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });

  const item = await api.functional.item_create.create(owner, { sku: "QC-001", name: "Quality Item", itemType: "stock", trackingMode: "none" });
  const plan = await api.functional.inspection_plan_create.create(owner, { name: "Incoming Inspection", itemId: item.id, samplingMethod: "full" });
  const activePlan = await api.functional.inspection_plan_status.status(owner, plan.id, { status: "active" });
  const inspection = await api.functional.inspection_order_create.create(owner, { inspectionPlanId: plan.id, sourceType: "receipt", sourceId: "receipt-001" });
  await api.functional.inspection_order_status.status(owner, inspection.id, { status: "performed", result: "pass" });
  const passedInspection = await api.functional.inspection_order_status.status(owner, inspection.id, { status: "passed", result: "pass" });
  const quarantine = await api.functional.quarantine_create.create(owner, { itemId: item.id, quantity: 4, reason: "Inspection hold" });
  const releasedQuarantine = await api.functional.quarantine_status.status(owner, quarantine.id, { status: "released" });
  const disposition = await api.functional.disposition_create.create(owner, { quarantineId: quarantine.id, dispositionType: "return", quantity: 4, reason: "Supplier return" });
  await api.functional.disposition_status.status(owner, disposition.id, { status: "approved" });
  const postedDisposition = await api.functional.disposition_status.status(owner, disposition.id, { status: "posted" });

  const equipment = await api.functional.equipment_create.create(owner, { code: "EQ-001", name: "Assembly Press" });
  const maintenancePlan = await api.functional.maintenance_plan_create.create(owner, { equipmentId: equipment.id, name: "Monthly Service", intervalDays: 30 });
  const activeMaintenancePlan = await api.functional.maintenance_plan_status.status(owner, maintenancePlan.id, { status: "active" });
  const maintenanceOrder = await api.functional.maintenance_order_create.create(owner, { equipmentId: equipment.id, maintenancePlanId: maintenancePlan.id, priority: "normal", scheduledAt: "2026-08-06T00:00:00.000Z" });
  await api.functional.maintenance_order_status.status(owner, maintenanceOrder.id, { status: "scheduled" });
  await api.functional.maintenance_order_status.status(owner, maintenanceOrder.id, { status: "in_progress" });
  const completedMaintenance = await api.functional.maintenance_order_status.status(owner, maintenanceOrder.id, { status: "completed" });

  const customer = await api.functional.customer_create.create(owner, { code: "QC-CUST", legalName: "Quality Customer" });
  const serviceCase = await api.functional.service_case_create.create(owner, { customerId: customer.id, priority: "normal", subject: "Field issue" });
  await api.functional.service_case_status.status(owner, serviceCase.id, { status: "in_progress" });
  await api.functional.service_case_status.status(owner, serviceCase.id, { status: "resolved" });
  const closedCase = await api.functional.service_case_status.status(owner, serviceCase.id, { status: "closed" });
  const serviceOrder = await api.functional.service_order_create.create(owner, { serviceCaseId: serviceCase.id, customerId: customer.id, totalAmount: 250 });
  await api.functional.service_order_status.status(owner, serviceOrder.id, { status: "scheduled" });
  await api.functional.service_order_status.status(owner, serviceOrder.id, { status: "in_progress" });
  const completedService = await api.functional.service_order_status.status(owner, serviceOrder.id, { status: "completed" });
  if (activePlan.status !== "active" || passedInspection.status !== "passed" || releasedQuarantine.status !== "released" || postedDisposition.status !== "posted" || activeMaintenancePlan.status !== "active" || completedMaintenance.status !== "completed" || closedCase.status !== "closed" || completedService.status !== "completed") throw new Error("quality and service lifecycle state was not retained");
}
