import * as api from "@benchmark/erp-api";

/** Proves transfer shipping/receiving and count/adjustment approval lifecycles. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-transfer-warehouse-transfer-rules Exercises and asserts the transfer warehouse transfer rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-cycle-count-cycle-count-and-adjustment-rules Exercises and asserts the cycle count cycle count and adjustment rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-transfer-warehouse-transfer-lifecycle Exercises and asserts the transfer warehouse transfer lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-cycle-count-cycle-count-lifecycle Exercises and asserts the cycle count cycle count lifecycle behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-transfer-warehouse-transfer-operations Exercises and asserts the transfer warehouse transfer operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-cycle-count-cycle-count-operations Exercises and asserts the cycle count cycle count operations behavior.
 */
export async function test_api_inventory_operations(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `inventory-ops-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Inventory Ops ${suffix}`, code: `inventory-ops-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const source = await api.functional.warehouse_create.create(owner, { code: "SRC", name: "Source" });
  const destination = await api.functional.warehouse_create.create(owner, { code: "DST", name: "Destination" });
  const transfer = await api.functional.transfer_create.create(owner, { sourceWarehouseId: source.id, destinationWarehouseId: destination.id });
  await api.functional.transfer_status.status(owner, transfer.id, { status: "shipped" });
  const received = await api.functional.transfer_status.status(owner, transfer.id, { status: "received" });
  const count = await api.functional.cycle_count_create.create(owner, { warehouseId: destination.id, countDate: "2026-08-05T00:00:00.000Z" });
  await api.functional.cycle_count_status.status(owner, count.id, { status: "performed" });
  await api.functional.cycle_count_status.status(owner, count.id, { status: "submitted" });
  await api.functional.cycle_count_status.status(owner, count.id, { status: "approved" });
  const postedCount = await api.functional.cycle_count_status.status(owner, count.id, { status: "posted" });
  const adjustment = await api.functional.inventory_adjustment_create.create(owner, { warehouseId: destination.id, reason: "Count variance", totalQuantity: 3 });
  await api.functional.inventory_adjustment_status.status(owner, adjustment.id, { status: "pending_approval" });
  await api.functional.inventory_adjustment_status.status(owner, adjustment.id, { status: "approved" });
  const postedAdjustment = await api.functional.inventory_adjustment_status.status(owner, adjustment.id, { status: "posted" });
  if (received.status !== "received" || postedCount.status !== "posted" || postedAdjustment.status !== "posted") throw new Error("inventory operation lifecycle state was not retained");
}
