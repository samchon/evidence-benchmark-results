import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves sales approval evaluates and snapshots customer credit exposure. */
export async function test_api_erp_sales_credit(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `SC${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `SC-${suffix}`, name: "Credit Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const limited = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: `Limited ${suffix}`, currency: "USD", creditLimit: 10 });
  const blockedOrder = await api.functional.erp.sales.order.orderCreate(owner.connection, { customerId: limited.id, currency: "USD", lines: [{ itemId: item.id, orderedQuantity: 2, unitPrice: 10, unitId: unit.id }] });
  let blocked = false;
  try { await api.functional.erp.sales.order.approve.orderApprove(owner.connection, blockedOrder.id); } catch { blocked = true; }
  if (!blocked) throw new Error("Sales approval ignored an exceeded customer credit limit.");
  const customer = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: `Within ${suffix}`, currency: "USD", creditLimit: 100 });
  const approvedOrder = await api.functional.erp.sales.order.orderCreate(owner.connection, { customerId: customer.id, currency: "USD", lines: [{ itemId: item.id, orderedQuantity: 2, unitPrice: 10, unitId: unit.id }] });
  const approved = await api.functional.erp.sales.order.approve.orderApprove(owner.connection, approvedOrder.id);
  if (approved.status !== "approved" || approved.creditStatus !== "within_limit" || approved.creditExposure !== 20) throw new Error("Sales credit exposure was not snapshotted on approval.");
}
