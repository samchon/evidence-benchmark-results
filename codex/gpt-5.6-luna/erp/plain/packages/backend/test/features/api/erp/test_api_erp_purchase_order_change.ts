import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";
import { MyGlobal } from "../../../../src/MyGlobal";

/** Proves purchase-order changes require approval and preserve applied values. */
export async function test_api_erp_purchase_order_change(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const vendor = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: `Change Vendor ${suffix}`, currency: "USD" });
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `PC${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `PC-${suffix}`, name: "Change Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `PCW${suffix.slice(-6)}`, name: "Change Warehouse" });
  const order = await api.functional.erp.purchase.order.orderCreate(owner.connection, { vendorId: vendor.id, currency: "USD", sourceRequestId: null, lines: [{ itemId: item.id, orderedQuantity: 2, unitPrice: 5, unitId: unit.id, warehouseId: warehouse.id }] });
  const sent = await api.functional.erp.purchase.order.orderTransition(owner.connection, (await api.functional.erp.purchase.order.orderTransition(owner.connection, order.id, "submitted")).id, "approved");
  const dispatched = await api.functional.erp.purchase.order.orderTransition(owner.connection, sent.id, "sent");
  const line = dispatched.lines[0];
  if (line === undefined) throw new Error("Purchase order change source line was not returned.");
  await api.functional.erp.control_ops.workflow.workflowCreate(owner.connection, { targetType: "purchase_order_change", priority: 1, conditions: { amountMin: 20 }, steps: [{ order: 1, approverType: "Owner", requiredApprovals: 1, escalationHours: 24, fallback: "Owner" }] });
  const request = await api.functional.erp.purchase.order.change_request.orderChangeRequest(owner.connection, dispatched.id, { reason: "Increase approved quantity.", lines: [{ itemId: line.itemId, orderedQuantity: 4, unitPrice: 6, unitId: line.unitId, warehouseId: warehouse.id }] });
  const approval = await MyGlobal.prisma.approvals.findUniqueOrThrow({ where: { id: request.id }, select: { workflow_id: true } });
  if (approval.workflow_id === null) throw new Error("Purchase-order change did not bind the matching conditional workflow.");
  let blocked = false;
  try { await api.functional.erp.purchase.order_change.apply.orderChangeApply(owner.connection, request.targetId); } catch { blocked = true; }
  if (!blocked) throw new Error("Purchase-order change was applied before approval.");
  await api.functional.erp.control_ops.approval.approvalResolve(owner.connection, request.id, "approved", { reason: "Approved procurement change." });
  const applied = await api.functional.erp.purchase.order_change.apply.orderChangeApply(owner.connection, request.targetId);
  if (applied.lines[0]?.orderedQuantity !== 4 || applied.lines[0]?.unitPrice !== 6) throw new Error("Approved purchase-order change did not preserve after values.");
}
