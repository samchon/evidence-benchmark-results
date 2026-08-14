import * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { create_owner, type OwnerFixture } from "../../../helpers/ErpFixtures";
import { MyGlobal } from "../../../../src/MyGlobal";
import { AllocationProvider } from "../../../../src/providers/AllocationProvider";

async function fixture(connection: api.IConnection): Promise<OwnerFixture & { unitId: string; itemId: string; warehouseId: string; locationId: string; customerId: string }> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `R${suffix.slice(-8)}`, name: "Review unit", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `REVIEW-${suffix}`, name: "Review inventory", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `RW${suffix.slice(-7)}`, name: "Review warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: `RL${suffix.slice(-7)}` });
  const customer = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: `Review customer ${randomUUID()}`, currency: "USD" });
  return { ...owner, unitId: unit.id, itemId: item.id, warehouseId: warehouse.id, locationId: location.id, customerId: customer.id };
}

export async function test_api_erp_mrp_forecast_outcome(connection: api.IConnection): Promise<void> {
  const owner = await fixture(connection);
  const run = await api.functional.erp.mrp.run.runCreate(owner.connection, { horizonFrom: "2026-08-10T00:00:00.000Z", horizonTo: "2026-09-10T00:00:00.000Z", triggerType: "manual", forecasts: [{ itemId: owner.itemId, quantity: 2, warehouseId: owner.warehouseId, requiredDate: "2026-08-20T00:00:00.000Z" }] });
  if (run.inputSnapshot.forecastQuantity !== 2 || run.inputSnapshot.demandQuantity !== 0 || run.summary.recommendationCount < 1) throw new Error("MRP did not include the forecast in its explainable demand and shortage outcome.");
  const recommendations = await api.functional.erp.mrp.run.recommendation.recommendationIndex(owner.connection, run.id, { page: 1, limit: 10, status: "open" });
  if (recommendations.data[0]?.itemId !== owner.itemId || recommendations.data[0]?.quantity !== 2) throw new Error("MRP forecast shortage did not produce the expected item quantity recommendation.");
}

export async function test_api_erp_quarantine_release_quantity_outcome(connection: api.IConnection): Promise<void> {
  const owner = await fixture(connection);
  const adjustment = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, quantity: 4, unitCost: 2, reason: "Quality release review" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, adjustment.id);
  const inspection = await api.functional.erp.operations.inspection.inspectionCreate(owner.connection, { itemId: owner.itemId, sourceType: "receipt", sourceId: null });
  const started = await api.functional.erp.operations.inspection.start.inspectionStart(owner.connection, inspection.id);
  await api.functional.erp.operations.inspection.inspectionFinalize(owner.connection, started.id, "failed");
  let refused = false;
  try { await api.functional.erp.quarantine.create(owner.connection, { inspectionId: inspection.id, itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, quantity: 5, reason: "Beyond identified stock" }); } catch { refused = true; }
  if (!refused) throw new Error("Quarantine accepted more quantity than the identified available stock.");
  const quarantine = await api.functional.erp.quarantine.create(owner.connection, { inspectionId: inspection.id, itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, quantity: 2, reason: "Quality release review" });
  await api.functional.erp.quarantine.approve(owner.connection, quarantine.id);
  const heldBalance = await api.functional.erp.stock.balance.balanceIndex(owner.connection, { page: 1, limit: 10, itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId });
  const held = heldBalance.data[0];
  if (held === undefined || held.onHand !== 4 || held.quarantined !== 2 || held.allocated !== 0 || held.available !== 2) throw new Error("Stock balance did not expose quarantine-aware availability state.");
  await api.functional.erp.quarantine.disposition(owner.connection, quarantine.id, "use_as_is", { reason: "Accepted after review" });
  const membership = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: owner.membershipId }, select: { organization_id: true } });
  const movements = await MyGlobal.prisma.stock_movements.findMany({ where: { organization_id: membership.organization_id, source_type: "quarantine", source_id: quarantine.id }, select: { type: true, quantity: true } });
  if (!movements.some((movement) => movement.type === "quality_quarantine" && movement.quantity === -2) || !movements.some((movement) => movement.type === "quality_release" && movement.quantity === 2)) throw new Error("Quality release did not preserve source-linked quarantine and release quantities.");
  const available = await api.functional.erp.allocation.availability.availabilityAt(owner.connection, { itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId });
  if (available.quarantined !== 0 || available.onHand !== 4 || available.available !== 4) throw new Error("Quality release did not restore the released quantity to availability without duplicating on-hand stock.");
}

export async function test_api_erp_quarantine_scrap_accounting_outcome(connection: api.IConnection): Promise<void> {
  const owner = await fixture(connection);
  const adjustment = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, quantity: 4, unitCost: 2, reason: "Quality scrap review" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, adjustment.id);
  const inspection = await api.functional.erp.operations.inspection.inspectionCreate(owner.connection, { itemId: owner.itemId, sourceType: "receipt", sourceId: null });
  const started = await api.functional.erp.operations.inspection.start.inspectionStart(owner.connection, inspection.id);
  await api.functional.erp.operations.inspection.inspectionFinalize(owner.connection, started.id, "failed");
  const quarantine = await api.functional.erp.quarantine.create(owner.connection, { inspectionId: inspection.id, itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, quantity: 2, reason: "Quality scrap review" });
  await api.functional.erp.quarantine.approve(owner.connection, quarantine.id);
  await api.functional.erp.quarantine.disposition(owner.connection, quarantine.id, "scrap", { reason: "Destroyed after failed inspection" });
  const membership = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: owner.membershipId }, select: { organization_id: true } });
  const movement = await MyGlobal.prisma.stock_movements.findFirst({ where: { organization_id: membership.organization_id, source_type: "quarantine", source_id: quarantine.id, type: "scrap" } });
  if (movement?.quantity !== -2 || movement.unit_cost !== 2) throw new Error("Scrap did not preserve the quantity and weighted cost in its immutable stock movement.");
  const journal = await MyGlobal.prisma.journals.findFirst({ where: { organization_id: membership.organization_id, source_module: "quarantine_scrap", source_id: quarantine.id, status: "posted" } });
  if (journal === null) throw new Error("Scrap did not post its source-linked loss journal.");
  const lines = await MyGlobal.prisma.journal_lines.findMany({ where: { journal_id: journal.id } });
  if (lines.reduce((sum, line) => sum + line.debit, 0) !== 4 || lines.reduce((sum, line) => sum + line.credit, 0) !== 4) throw new Error("Scrap loss accounting was not balanced at the disposition source.");
}

export async function test_api_erp_service_order_settlement_outcome(connection: api.IConnection): Promise<void> {
  const owner = await fixture(connection);
  const serviceItem = await api.functional.erp.item.itemCreate(owner.connection, { sku: `SERVICE-${Date.now()}-${randomUUID().slice(0, 6)}`, name: "Review service", type: "service", unitId: owner.unitId, trackingMode: "none" });
  const employee = await api.functional.erp.workforce.employee.employeeCreate(owner.connection, { employeeNumber: `SERVICE-${Date.now()}`, department: "Service" });
  const adjustment = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, quantity: 3, unitCost: 4, reason: "Service parts" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, adjustment.id);
  const order = await api.functional.erp.service_order.create(owner.connection, { customerId: owner.customerId, serviceType: "warranty repair", itemId: serviceItem.id, serialNumber: "SER-REVIEW", scheduledAt: "2026-08-15T10:00:00.000Z" });
  await api.functional.erp.service_order.update(owner.connection, order.id, { assigneeId: employee.id, warranty: true, billable: false });
  const assigned = await api.functional.erp.service_order.assign(owner.connection, order.id);
  const started = await api.functional.erp.service_order.start(owner.connection, assigned.id);
  await api.functional.erp.service_order.part(owner.connection, started.id, { itemId: owner.itemId, quantity: 1, warehouseId: owner.warehouseId, locationId: owner.locationId, unitCost: 4 });
  await api.functional.erp.service_order.labor(owner.connection, started.id, { hours: 2, rate: 10 });
  await api.functional.erp.service_order.update(owner.connection, started.id, { resolution: "Repaired under warranty" });
  const completed = await api.functional.erp.service_order.complete(owner.connection, started.id);
  if (completed.status !== "completed" || completed.parts.length !== 1 || completed.labor.length !== 1) throw new Error("Service order did not retain explicit part and labor execution evidence.");
  const settled = await api.functional.erp.service_order.warranty_expense.warrantyExpense(owner.connection, completed.id);
  if (settled.warrantyExpenseJournalId === null) throw new Error("Warranty service did not create a source-linked expense journal.");
  const membership = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: owner.membershipId }, select: { organization_id: true } });
  const movement = await MyGlobal.prisma.stock_movements.findFirst({ where: { organization_id: membership.organization_id, source_type: "service_order", source_id: order.id, type: "service_consumption" } });
  if (movement?.quantity !== -1) throw new Error("Service part consumption did not create the expected source-linked stock movement.");
  const invoiceOrder = await api.functional.erp.service_order.create(owner.connection, { customerId: owner.customerId, serviceType: "billable inspection", itemId: serviceItem.id, scheduledAt: "2026-08-16T10:00:00.000Z" });
  await api.functional.erp.service_order.update(owner.connection, invoiceOrder.id, { assigneeId: employee.id, warranty: false, billable: true });
  const invoiceAssigned = await api.functional.erp.service_order.assign(owner.connection, invoiceOrder.id);
  const invoiceStarted = await api.functional.erp.service_order.start(owner.connection, invoiceAssigned.id);
  await api.functional.erp.service_order.update(owner.connection, invoiceStarted.id, { resolution: "Inspection complete" });
  const invoiceCompleted = await api.functional.erp.service_order.complete(owner.connection, invoiceStarted.id);
  const invoiced = await api.functional.erp.service_order.invoice(owner.connection, invoiceCompleted.id);
  if (invoiced.status !== "invoiced" || invoiced.invoiceId === null) throw new Error("Billable service did not create a linked sales invoice.");
}

export async function test_api_erp_stock_traceability_outcome(connection: api.IConnection): Promise<void> {
  const owner = await fixture(connection);
  const adjustment = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, quantity: 3, unitCost: 2, reason: "Stock traceability review" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, adjustment.id);
  const movements = await api.functional.erp.stock.movement.movementIndex(owner.connection, { page: 1, limit: 10, itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, type: "inventory_adjustment", sourceType: "inventory_adjustment", sourceId: adjustment.id, operatorId: owner.membershipId });
  const movement = movements.data.find((row) => row.sourceId === adjustment.id);
  if (movement === undefined || movement.unitCost !== 2 || movement.operatorId !== owner.membershipId) throw new Error("Stock movement traceability did not expose unit cost and operator attribution.");
  const balances = await api.functional.erp.stock.balance.balanceIndex(owner.connection, { page: 1, limit: 10, itemId: owner.itemId, warehouseId: owner.warehouseId, locationId: owner.locationId, sourceType: "inventory_adjustment" });
  const balance = balances.data.find((row) => row.itemId === owner.itemId && row.warehouseId === owner.warehouseId && row.locationId === owner.locationId);
  if (balance === undefined || balance.averageUnitCost !== 2 || balance.available !== 3) throw new Error("Stock balance did not expose the weighted-average cost and availability outcome.");
}

export async function test_api_erp_purchase_return_availability_outcome(connection: api.IConnection): Promise<void> {
  const owner = await fixture(connection);
  const order = await api.functional.erp.purchase.order.orderCreate(owner.connection, { vendorId: (await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: `Review vendor ${randomUUID()}`, currency: "USD" })).id, currency: "USD", lines: [{ itemId: owner.itemId, orderedQuantity: 2, unitPrice: 2, unitId: owner.unitId, warehouseId: owner.warehouseId }] });
  const submitted = await api.functional.erp.purchase.order.orderTransition(owner.connection, order.id, "submitted");
  const approved = await api.functional.erp.purchase.order.orderTransition(owner.connection, submitted.id, "approved");
  const sent = await api.functional.erp.purchase.order.orderTransition(owner.connection, approved.id, "sent");
  const receipt = await api.functional.erp.purchase.receipt.receiptCreate(owner.connection, { orderId: sent.id, lines: [{ orderLineId: sent.lines[0]!.id, receivedQuantity: 2, acceptedQuantity: 2, rejectedQuantity: 0, warehouseId: owner.warehouseId, locationId: owner.locationId }] });
  await api.functional.erp.purchase.receipt.post.receiptPost(owner.connection, receipt.id);
  const salesOrder = await api.functional.erp.sales.order.orderCreate(owner.connection, { customerId: owner.customerId, currency: "USD", lines: [{ itemId: owner.itemId, orderedQuantity: 2, unitPrice: 4, unitId: owner.unitId }] });
  await api.functional.erp.sales.order.transition.orderTransition(owner.connection, salesOrder.id, "submitted");
  const approvedOrder = await api.functional.erp.sales.order.approve.orderApprove(owner.connection, salesOrder.id);
  await api.functional.erp.allocation.create(owner.connection, { orderLineId: approvedOrder.lines[0]!.id, warehouseId: owner.warehouseId, locationId: owner.locationId, quantity: 2 });
  const purchaseReturn = await api.functional.erp.extended_finance.purchase_return.purchaseReturnCreate(owner.connection, { receiptId: receipt.id, lines: [{ orderLineId: sent.lines[0]!.id, quantity: 1, warehouseId: owner.warehouseId, locationId: owner.locationId, lotId: null, serialCode: null }] });
  let refused = false;
  try { await api.functional.erp.extended_finance.purchase_return.post.purchaseReturnPost(owner.connection, purchaseReturn.id); } catch { refused = true; }
  if (!refused) throw new Error("Purchase return posted below the organization negative-stock availability policy.");
  const membership = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: owner.membershipId }, select: { organization_id: true } });
  const movement = await MyGlobal.prisma.stock_movements.findFirst({ where: { organization_id: membership.organization_id, source_type: "purchase_return", source_id: purchaseReturn.id } });
  const source = await MyGlobal.prisma.purchase_order_lines.findUniqueOrThrow({ where: { id: sent.lines[0]!.id } });
  if (movement !== null || source.received_quantity !== 2) throw new Error("Refused purchase return partially applied stock or source quantity effects.");
}

export async function test_api_erp_tracked_identity_outcome(connection: api.IConnection): Promise<void> {
  const owner = await fixture(connection);
  const membership = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: owner.membershipId }, select: { organization_id: true } });
  const trackedItem = await api.functional.erp.item.itemCreate(owner.connection, { sku: `TRACKED-${Date.now()}-${randomUUID().slice(0, 6)}`, name: "Tracked review inventory", type: "inventory", unitId: owner.unitId, trackingMode: "lot" });
  const lotA = await MyGlobal.prisma.lots.create({ data: { id: randomUUID(), organization_id: membership.organization_id, item_id: trackedItem.id, code: `LOT-A-${randomUUID().slice(0, 8)}`, status: "active", created_at: new Date() } });
  const lotB = await MyGlobal.prisma.lots.create({ data: { id: randomUUID(), organization_id: membership.organization_id, item_id: trackedItem.id, code: `LOT-B-${randomUUID().slice(0, 8)}`, status: "active", created_at: new Date() } });
  const adjustment = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: trackedItem.id, warehouseId: owner.warehouseId, locationId: owner.locationId, lotId: lotA.id, quantity: 3, unitCost: 5, reason: "Tracked identity review" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, adjustment.id);
  const inspection = await api.functional.erp.operations.inspection.inspectionCreate(owner.connection, { itemId: trackedItem.id, sourceType: "receipt", sourceId: null });
  const started = await api.functional.erp.operations.inspection.start.inspectionStart(owner.connection, inspection.id);
  await api.functional.erp.operations.inspection.inspectionFinalize(owner.connection, started.id, "failed");
  let refusedWrongLot = false;
  try { await api.functional.erp.quarantine.create(owner.connection, { inspectionId: inspection.id, itemId: trackedItem.id, warehouseId: owner.warehouseId, locationId: owner.locationId, lotId: lotB.id, quantity: 1, reason: "Wrong tracked lot" }); } catch { refusedWrongLot = true; }
  if (!refusedWrongLot) throw new Error("Tracked quarantine used aggregate stock and accepted a lot with no eligible quantity.");
  const quarantine = await api.functional.erp.quarantine.create(owner.connection, { inspectionId: inspection.id, itemId: trackedItem.id, warehouseId: owner.warehouseId, locationId: owner.locationId, lotId: lotA.id, quantity: 1, reason: "Correct tracked lot" });
  await api.functional.erp.quarantine.approve(owner.connection, quarantine.id);
  const movement = await MyGlobal.prisma.stock_movements.findFirst({ where: { organization_id: membership.organization_id, source_type: "quarantine", source_id: quarantine.id, type: "quality_quarantine" }, select: { lot_id: true, quantity: true } });
  if (movement?.lot_id !== lotA.id || movement.quantity !== -1) throw new Error("Tracked quarantine did not preserve the selected lot in its source-linked movement.");
  let refusedSerialQuantity = false;
  try { AllocationProvider.validateTracking("serial", null, "SERIAL-UNIT", 2); } catch { refusedSerialQuantity = true; }
  if (!refusedSerialQuantity) throw new Error("Serial tracking accepted more than one unit for a single serial identity.");
}
