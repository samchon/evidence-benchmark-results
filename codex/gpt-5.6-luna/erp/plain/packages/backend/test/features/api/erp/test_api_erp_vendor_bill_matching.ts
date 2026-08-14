import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves vendor-bill matching reconciles purchase order, receipt, and bill evidence. */
export async function test_api_erp_vendor_bill_matching(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const vendor = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: `Match Vendor ${suffix}`, currency: "USD" });
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `VB${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `VB-${suffix}`, name: "Matched Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `VBW${suffix.slice(-6)}`, name: "Matching Warehouse" });
  const order = await api.functional.erp.purchase.order.orderCreate(owner.connection, { vendorId: vendor.id, currency: "USD", sourceRequestId: null, lines: [{ itemId: item.id, orderedQuantity: 2, unitPrice: 2, unitId: unit.id, warehouseId: warehouse.id }] });
  const sent = await api.functional.erp.purchase.order.orderTransition(owner.connection, await api.functional.erp.purchase.order.orderTransition(owner.connection, order.id, "submitted").then((row) => row.id), "approved").then((row) => api.functional.erp.purchase.order.orderTransition(owner.connection, row.id, "sent"));
  const orderLine = sent.lines[0];
  if (orderLine === undefined) throw new Error("Matching purchase-order line was not returned.");
  const receipt = await api.functional.erp.purchase.receipt.receiptCreate(owner.connection, { orderId: sent.id, lines: [{ orderLineId: orderLine.id, receivedQuantity: 2, acceptedQuantity: 2, rejectedQuantity: 0, warehouseId: warehouse.id, locationId: (await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "MATCH" })).id }] });
  await api.functional.erp.purchase.receipt.post.receiptPost(owner.connection, receipt.id);
  const bill = await api.functional.erp.extended_finance.vendor_bill.billCreate(owner.connection, { vendorId: vendor.id, currency: "USD", lines: [{ purchaseOrderLineId: orderLine.id, itemId: item.id, quantity: 2, amount: 4, taxAmount: 0 }] });
  const match = await api.functional.erp.extended_finance.vendor_bill.match.billMatch(owner.connection, bill.id);
  if (match.status !== "matched" || match.lines[0]?.receivedQuantity !== 2 || match.lines[0]?.billedQuantity !== 2) throw new Error("Vendor bill three-way matching did not reconcile source quantities.");
}

/** Proves quantity and price variances require an approval before a bill can post. */
export async function test_api_erp_vendor_bill_variance_approval(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const vendor = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: `Variance Vendor ${suffix}`, currency: "USD" });
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `VA${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `VA-${suffix}`, name: "Variance Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `VAW${suffix.slice(-6)}`, name: "Variance Warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "VAR" });
  const order = await api.functional.erp.purchase.order.orderCreate(owner.connection, { vendorId: vendor.id, currency: "USD", sourceRequestId: null, lines: [{ itemId: item.id, orderedQuantity: 1, unitPrice: 4, unitId: unit.id, warehouseId: warehouse.id }] });
  const submitted = await api.functional.erp.purchase.order.orderTransition(owner.connection, order.id, "submitted");
  const approved = await api.functional.erp.purchase.order.orderTransition(owner.connection, submitted.id, "approved");
  const sent = await api.functional.erp.purchase.order.orderTransition(owner.connection, approved.id, "sent");
  const line = sent.lines[0];
  if (line === undefined) throw new Error("Variance purchase order line was not returned.");
  const receipt = await api.functional.erp.purchase.receipt.receiptCreate(owner.connection, { orderId: sent.id, lines: [{ orderLineId: line.id, receivedQuantity: 1, acceptedQuantity: 1, rejectedQuantity: 0, warehouseId: warehouse.id, locationId: location.id }] });
  await api.functional.erp.purchase.receipt.post.receiptPost(owner.connection, receipt.id);
  const bill = await api.functional.erp.extended_finance.vendor_bill.billCreate(owner.connection, { vendorId: vendor.id, currency: "USD", lines: [{ purchaseOrderLineId: line.id, itemId: item.id, quantity: 1, amount: 5, taxAmount: 0 }] });
  const match = await api.functional.erp.extended_finance.vendor_bill.match.billMatch(owner.connection, bill.id);
  if (match.status !== "variance" || match.lines[0]?.priceVariance !== 1) throw new Error("Vendor-bill price variance was not measured.");
  let refused = false;
  try {
    await api.functional.erp.extended_finance.vendor_bill.billTransition(owner.connection, bill.id, "approved");
  } catch {
    refused = true;
  }
  if (!refused) throw new Error("A vendor-bill variance was approved without an approval record.");
  const approvals = await api.functional.erp.control_ops.approval.approvalIndex(owner.connection, { page: 1, limit: 100 });
  const varianceApproval = approvals.data.find((approval) => approval.targetType === "vendor_bill_variance" && approval.targetId === bill.id);
  if (varianceApproval === undefined || varianceApproval.status !== "pending") throw new Error("Vendor-bill variance approval was not created as pending.");
  const resolvedApproval = await api.functional.erp.control_ops.approval.approvalResolve(owner.connection, varianceApproval.id, "approved", { reason: "Approved price variance." });
  if (resolvedApproval.status !== "approved") throw new Error("Vendor-bill variance approval was not resolved.");
  const resolvedBill = await api.functional.erp.extended_finance.vendor_bill.billTransition(owner.connection, bill.id, "approved");
  const posted = await api.functional.erp.extended_finance.vendor_bill.post.billPost(owner.connection, resolvedBill.id);
  if (posted.status !== "posted") throw new Error("An approved vendor-bill variance did not post.");
}

/** Proves a vendor bill cannot attach a purchase-order line to the wrong item. */
export async function test_api_erp_vendor_bill_source_identity(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const vendor = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: `Identity Vendor ${suffix}`, currency: "USD" });
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `ID${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `ID-${suffix}`, name: "Source Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const other = await api.functional.erp.item.itemCreate(owner.connection, { sku: `ID-OTHER-${suffix}`, name: "Wrong Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `IDW${suffix.slice(-6)}`, name: "Identity Warehouse" });
  const order = await api.functional.erp.purchase.order.orderCreate(owner.connection, { vendorId: vendor.id, currency: "USD", sourceRequestId: null, lines: [{ itemId: item.id, orderedQuantity: 1, unitPrice: 2, unitId: unit.id, warehouseId: warehouse.id }] });
  const submitted = await api.functional.erp.purchase.order.orderTransition(owner.connection, order.id, "submitted");
  const approved = await api.functional.erp.purchase.order.orderTransition(owner.connection, submitted.id, "approved");
  const sent = await api.functional.erp.purchase.order.orderTransition(owner.connection, approved.id, "sent");
  const line = sent.lines[0];
  if (line === undefined) throw new Error("Source purchase-order line was not returned.");
  let refused = false;
  try { await api.functional.erp.extended_finance.vendor_bill.billCreate(owner.connection, { vendorId: vendor.id, currency: "USD", lines: [{ purchaseOrderLineId: line.id, itemId: other.id, quantity: 1, amount: 2, taxAmount: 0 }] }); } catch { refused = true; }
  if (!refused) throw new Error("A vendor bill accepted an item different from its purchase-order source line.");
}
