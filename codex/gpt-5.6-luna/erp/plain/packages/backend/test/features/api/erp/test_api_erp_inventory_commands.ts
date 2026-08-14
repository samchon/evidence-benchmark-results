import * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { create_owner } from "../../../helpers/ErpFixtures";
import { MyGlobal } from "../../../../src/MyGlobal";

/** Proves a shipped transfer can be received in multiple bounded quantities. */
export async function test_api_erp_transfer_partial_receipt(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `TR${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `TR-${suffix}`, name: "Transfer Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const source = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `S${suffix.slice(-6)}`, name: "Source" });
  const target = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `T${suffix.slice(-6)}`, name: "Target" });
  const sourceLocation = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: source.id, code: "SRC" });
  const targetLocation = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: target.id, code: "DST" });
  const adjustment = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: source.id, locationId: sourceLocation.id, quantity: 5, unitCost: 1, reason: "Opening" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, adjustment.id);
  const transfer = await api.functional.erp.inventory.transfer.transferCreate(owner.connection, { fromWarehouseId: source.id, toWarehouseId: target.id, lines: [{ itemId: item.id, quantity: 5, fromLocationId: sourceLocation.id, toLocationId: targetLocation.id, unitCost: 1 }] });
  const shipped = await api.functional.erp.inventory.transfer.ship.transferShip(owner.connection, transfer.id);
  const line = shipped.lines[0];
  if (line === undefined) throw new Error("Transfer line was not returned.");
  const partial = await api.functional.erp.inventory.transfer.receive.transferReceive(owner.connection, shipped.id, { lines: [{ lineId: line.id, quantity: 2 }] });
  if (partial.status !== "partial" || partial.lines[0]?.receivedQuantity !== 2) throw new Error("Partial transfer receipt was not retained.");
  const complete = await api.functional.erp.inventory.transfer.receive.transferReceive(owner.connection, partial.id, { lines: [{ lineId: line.id, quantity: 3 }] });
  if (complete.status !== "received" || complete.lines[0]?.receivedQuantity !== 5) throw new Error("Transfer did not complete after receiving its remainder.");
}

/** Proves an empty receipt skips lines whose remainder is already zero. */
export async function test_api_erp_transfer_receive_all_remaining(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `TA${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `TA-${suffix}`, name: "Transfer All Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const source = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `AS${suffix.slice(-6)}`, name: "Source" });
  const target = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `AT${suffix.slice(-6)}`, name: "Target" });
  const sourceLocation = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: source.id, code: "SRC" });
  const targetA = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: target.id, code: "DSTA" });
  const targetB = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: target.id, code: "DSTB" });
  const adjustment = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: source.id, locationId: sourceLocation.id, quantity: 4, unitCost: 1, reason: "Opening" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, adjustment.id);
  const transfer = await api.functional.erp.inventory.transfer.transferCreate(owner.connection, { fromWarehouseId: source.id, toWarehouseId: target.id, lines: [{ itemId: item.id, quantity: 2, fromLocationId: sourceLocation.id, toLocationId: targetA.id, unitCost: 1 }, { itemId: item.id, quantity: 2, fromLocationId: sourceLocation.id, toLocationId: targetB.id, unitCost: 1 }] });
  const shipped = await api.functional.erp.inventory.transfer.ship.transferShip(owner.connection, transfer.id);
  const firstLine = shipped.lines[0];
  if (firstLine === undefined) throw new Error("Transfer all-remaining setup did not return a line.");
  const partial = await api.functional.erp.inventory.transfer.receive.transferReceive(owner.connection, shipped.id, { lines: [{ lineId: firstLine.id, quantity: 2 }] });
  const complete = await api.functional.erp.inventory.transfer.receive.transferReceive(owner.connection, partial.id, { lines: [] });
  if (complete.status !== "received" || complete.lines.some((line) => line.receivedQuantity !== line.quantity)) throw new Error("Empty transfer receipt did not receive every positive remainder.");
}

/** Proves serial adjustments reject a multi-unit quantity for one identity. */
export async function test_api_erp_serial_adjustment_unit_invariant(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `SU${Date.now()}`.slice(-8), name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `SU-${Date.now()}`, name: "Serial Unit", type: "inventory", unitId: unit.id, trackingMode: "serial" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `SUW${Date.now()}`.slice(-8), name: "Serial Warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "SERIAL" });
  let refused = false;
  try {
    await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: warehouse.id, locationId: location.id, serialCode: "SERIAL-UNIT", quantity: 2, unitCost: 1, reason: "Invalid serial quantity" });
  } catch {
    refused = true;
  }
  if (!refused) throw new Error("A serial adjustment accepted more than one unit for a single serial identity.");
  const signed = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: warehouse.id, locationId: location.id, serialCode: "SERIAL-UNIT", quantity: -1, unitCost: 1, reason: "Signed serial correction" });
  if (signed.quantity !== -1 || signed.serialCode !== "SERIAL-UNIT") throw new Error("A signed single-unit serial adjustment did not retain its tracking identity.");
}

/** Proves a serialized transfer cannot be received as a fractional unit. */
export async function test_api_erp_serial_transfer_receipt_unit_invariant(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = randomUUID().slice(0, 8);
  const membership = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: owner.membershipId }, select: { organization_id: true } });
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `ST${suffix}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `ST-${suffix}`, name: "Serialized Transfer", type: "inventory", unitId: unit.id, trackingMode: "serial" });
  const serialCode = `SERIAL-${suffix}`;
  await MyGlobal.prisma.serials.create({ data: { id: randomUUID(), organization_id: membership.organization_id, item_id: item.id, code: serialCode, status: "active", created_at: new Date() } });
  const source = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `STF${suffix}`, name: "Serial From" });
  const target = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `STT${suffix}`, name: "Serial To" });
  const fromLocation = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: source.id, code: "FROM" });
  const toLocation = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: target.id, code: "TO" });
  const opening = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: source.id, locationId: fromLocation.id, serialCode, quantity: 1, unitCost: 1, reason: "Serialized transfer stock" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, opening.id);
  await MyGlobal.prisma.serials.updateMany({ where: { organization_id: membership.organization_id, item_id: item.id, code: serialCode }, data: { status: "on_hand" } });
  const transfer = await api.functional.erp.inventory.transfer.transferCreate(owner.connection, { fromWarehouseId: source.id, toWarehouseId: target.id, lines: [{ itemId: item.id, quantity: 1, fromLocationId: fromLocation.id, toLocationId: toLocation.id, serialCode, unitCost: 1 }] });
  const shipped = await api.functional.erp.inventory.transfer.ship.transferShip(owner.connection, transfer.id);
  const line = shipped.lines[0];
  if (line === undefined) throw new Error("Serialized transfer line was not returned.");
  let refused = false;
  try {
    await api.functional.erp.inventory.transfer.receive.transferReceive(owner.connection, shipped.id, { lines: [{ lineId: line.id, quantity: 0.5 }] });
  } catch {
    refused = true;
  }
  if (!refused) throw new Error("A serialized transfer accepted a fractional receipt quantity.");
}

/** Proves a serialized sales return cannot be created for a fractional unit. */
export async function test_api_erp_serial_sales_return_unit_invariant(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = randomUUID().slice(0, 8);
  const membership = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: owner.membershipId }, select: { organization_id: true } });
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `SR${suffix}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `SR-${suffix}`, name: "Serialized Return", type: "inventory", unitId: unit.id, trackingMode: "serial" });
  const serialCode = `RETURN-${suffix}`;
  await MyGlobal.prisma.serials.create({ data: { id: randomUUID(), organization_id: membership.organization_id, item_id: item.id, code: serialCode, status: "active", created_at: new Date() } });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `SRW${suffix}`, name: "Return Warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "RETURN" });
  const opening = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: warehouse.id, locationId: location.id, serialCode, quantity: 1, unitCost: 1, reason: "Serialized return stock" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, opening.id);
  await MyGlobal.prisma.serials.updateMany({ where: { organization_id: membership.organization_id, item_id: item.id, code: serialCode }, data: { status: "on_hand" } });
  const customer = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: `Return Customer ${suffix}`, currency: "USD" });
  const order = await api.functional.erp.sales.order.orderCreate(owner.connection, { customerId: customer.id, currency: "USD", lines: [{ itemId: item.id, orderedQuantity: 1, unitPrice: 5, unitId: unit.id }] });
  const approved = await api.functional.erp.sales.order.approve.orderApprove(owner.connection, order.id);
  const orderLine = approved.lines[0];
  if (orderLine === undefined) throw new Error("Serialized return sales line was not returned.");
  const shipment = await api.functional.erp.sales.shipment.shipmentCreate(owner.connection, { orderId: approved.id, lines: [{ orderLineId: orderLine.id, quantity: 1, warehouseId: warehouse.id, locationId: location.id, serialCode }] });
  const posted = await api.functional.erp.sales.shipment.post.shipmentPost(owner.connection, shipment.id);
  const shipmentLine = posted.lines[0];
  if (shipmentLine === undefined) throw new Error("Serialized return shipment line was not returned.");
  let refused = false;
  try {
    await api.functional.erp.extended_finance.sales_return.salesReturnCreate(owner.connection, { customerId: customer.id, lines: [{ shipmentLineId: shipmentLine.id, quantity: 0.5, restock: true, warehouseId: warehouse.id, locationId: location.id, serialCode }] });
  } catch {
    refused = true;
  }
  if (!refused) throw new Error("A serialized sales return accepted a fractional unit.");
}

/** Proves a cycle-count rejection requires and retains an explicit reason. */
export async function test_api_erp_cycle_rejection_reason(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `CR${Date.now()}`.slice(-8), name: "Count Warehouse" });
  const count = await api.functional.erp.inventory.cycle_count.cycleCreate(owner.connection, { warehouseId: warehouse.id, reason: "Routine", lines: [] });
  const performed = await api.functional.erp.inventory.cycle_count.perform.cyclePerform(owner.connection, count.id, []);
  const submitted = await api.functional.erp.inventory.cycle_count.submit.cycleSubmit(owner.connection, performed.id);
  const rejected = await api.functional.erp.inventory.cycle_count.reject.cycleReject(owner.connection, submitted.id, { reason: " recount required " });
  if (rejected.status !== "rejected" || rejected.reason !== " recount required ") throw new Error("Cycle-count rejection reason was not retained.");
}

/** Proves correction creates a new draft reversing adjustment linked to the posted source. */
export async function test_api_erp_inventory_adjustment_reverse(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `RV${Date.now()}`.slice(-8), name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `RV-${Date.now()}`, name: "Reversible", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `RVW${Date.now()}`.slice(-8), name: "Reverse Warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "REV" });
  const source = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: warehouse.id, locationId: location.id, quantity: 4, unitCost: 2, reason: "Mistaken count" });
  const posted = await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, source.id);
  const reverse = await api.functional.erp.inventory.adjustment.reverse.adjustmentReverse(owner.connection, posted.id, { reason: "Corrected count" });
  if (reverse.status !== "draft" || reverse.quantity !== -4 || reverse.reversesId !== posted.id) throw new Error("Reversing adjustment was not linked to the posted source.");
}

/** Proves pick, pack, post, deliver, and cancel shipment lifecycle transitions. */
export async function test_api_erp_sales_shipment_lifecycle(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `SH${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `SH-${suffix}`, name: "Shipment Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `SHW${suffix.slice(-6)}`, name: "Shipment Warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "SHIP" });
  const adjustment = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: warehouse.id, locationId: location.id, quantity: 1, unitCost: 1, reason: "Opening" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, adjustment.id);
  const customer = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: `Shipment Customer ${suffix}`, currency: "USD" });
  const order = await api.functional.erp.sales.order.orderCreate(owner.connection, { customerId: customer.id, currency: "USD", lines: [{ itemId: item.id, orderedQuantity: 1, unitPrice: 5, unitId: unit.id }] });
  const approved = await api.functional.erp.sales.order.approve.orderApprove(owner.connection, order.id);
  const line = approved.lines[0];
  if (line === undefined) throw new Error("Sales line was not returned.");
  const shipment = await api.functional.erp.sales.shipment.shipmentCreate(owner.connection, { orderId: approved.id, lines: [{ orderLineId: line.id, quantity: 1, warehouseId: warehouse.id, locationId: location.id }] });
  const picked = await api.functional.erp.sales.shipment.pick.shipmentPick(owner.connection, shipment.id);
  const packed = await api.functional.erp.sales.shipment.pack.shipmentPack(owner.connection, picked.id);
  const posted = await api.functional.erp.sales.shipment.post.shipmentPost(owner.connection, packed.id);
  const delivered = await api.functional.erp.sales.shipment.deliver.shipmentDeliver(owner.connection, posted.id);
  if (delivered.status !== "delivered") throw new Error("Shipment delivery lifecycle was not persisted.");
  const movement = await MyGlobal.prisma.stock_movements.findFirst({ where: { source_type: "shipment", source_id: posted.id, type: "sales_shipment" }, select: { unit_cost: true } });
  if (movement === null || movement.unit_cost !== 1) throw new Error("Shipment did not use the weighted-average stock cost.");
  const membership = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: owner.membershipId }, select: { organization_id: true } });
  const journal = await MyGlobal.prisma.journals.findFirst({ where: { organization_id: membership.organization_id, source_module: "sales_shipment", source_id: posted.id, status: "posted" }, select: { id: true } });
  if (journal === null) throw new Error("Shipment did not create a source-linked COGS journal.");
  const cancelOrder = await api.functional.erp.sales.order.orderCreate(owner.connection, { customerId: customer.id, currency: "USD", lines: [{ itemId: item.id, orderedQuantity: 1, unitPrice: 5, unitId: unit.id }] });
  const cancelApproved = await api.functional.erp.sales.order.approve.orderApprove(owner.connection, cancelOrder.id);
  const cancelLine = cancelApproved.lines[0];
  if (cancelLine === undefined) throw new Error("Cancellation sales line was not returned.");
  const cancellable = await api.functional.erp.sales.shipment.shipmentCreate(owner.connection, { orderId: cancelApproved.id, lines: [{ orderLineId: cancelLine.id, quantity: 1, warehouseId: warehouse.id, locationId: location.id }] });
  const cancelled = await api.functional.erp.sales.shipment.cancel.shipmentCancel(owner.connection, cancellable.id);
  if (cancelled.status !== "cancelled") throw new Error("Unposted shipment was not cancellable.");
}

/** Proves draft invoice editing, submission, sending, and preserving void correction. */
export async function test_api_erp_invoice_commands(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `IN${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `IN-${suffix}`, name: "Invoice Item", type: "service", unitId: unit.id, trackingMode: "none" });
  const customer = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: `Invoice Customer ${suffix}`, currency: "USD" });
  const order = await api.functional.erp.sales.order.orderCreate(owner.connection, { customerId: customer.id, currency: "USD", lines: [{ itemId: item.id, orderedQuantity: 1, unitPrice: 7, unitId: unit.id }] });
  const approved = await api.functional.erp.sales.order.approve.orderApprove(owner.connection, order.id);
  const line = approved.lines[0];
  if (line === undefined) throw new Error("Invoice source line was not returned.");
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `INW${suffix.slice(-6)}`, name: "Invoice Warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "INV" });
  const shipment = await api.functional.erp.sales.shipment.shipmentCreate(owner.connection, { orderId: approved.id, lines: [{ orderLineId: line.id, quantity: 1, warehouseId: warehouse.id, locationId: location.id }] });
  await api.functional.erp.sales.shipment.post.shipmentPost(owner.connection, shipment.id);
  const invoice = await api.functional.erp.sales_finance.invoice.invoiceCreate(owner.connection, { orderId: approved.id, currency: "USD", lines: [{ orderLineId: line.id, quantity: 1, amount: 7, taxAmount: 0 }] });
  await api.functional.erp.config.currency.currencyCreate(owner.connection, { code: "EUR", name: "Euro", precision: 2 });
  await api.functional.erp.config.exchange_rate.rateCreate(owner.connection, { sourceCurrency: "EUR", targetCurrency: "USD", effectiveAt: new Date().toISOString(), rate: 1.1, origin: "manual" });
  const revised = await api.functional.erp.sales_finance.invoice.invoiceUpdate(owner.connection, invoice.id, { currency: "EUR" });
  const submitted = await api.functional.erp.sales_finance.invoice.submit.invoiceSubmit(owner.connection, revised.id);
  const approvedInvoice = await api.functional.erp.sales_finance.invoice.approve.invoiceApprove(owner.connection, submitted.id);
  const posted = await api.functional.erp.sales_finance.invoice.post.invoicePost(owner.connection, approvedInvoice.id);
  const sent = await api.functional.erp.sales_finance.invoice.send.invoiceSend(owner.connection, posted.id);
  const voided = await api.functional.erp.sales_finance.invoice._void.invoiceVoid(owner.connection, sent.id, { reason: "Customer correction" });
  if (voided.status !== "void" || voided.currency !== "EUR") throw new Error("Invoice lifecycle correction was not preserved.");
}

/** Proves production draft revision, scrap capture, and closure approval transitions. */
export async function test_api_erp_production_commands(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `PR${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `PR-${suffix}`, name: "Production Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `PRW${suffix.slice(-6)}`, name: "Production Warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "PROD" });
  const draft = await api.functional.erp.operations.production.productionCreate(owner.connection, { finishedItemId: item.id, plannedQuantity: 2, bomId: null, routingId: null, warehouseId: warehouse.id, locationId: location.id });
  const revised = await api.functional.erp.operations.production.productionUpdate(owner.connection, draft.id, { plannedQuantity: 3 });
  const listed = await api.functional.erp.operations.production.productionIndex(owner.connection, { page: 1, limit: 20 });
  if (!listed.data.some((row) => row.id === revised.id)) throw new Error("Production draft was not listed.");
  const released = await api.functional.erp.operations.production.release.productionRelease(owner.connection, revised.id);
  const started = await api.functional.erp.operations.production.start.productionStart(owner.connection, released.id);
  const scrapped = await api.functional.erp.operations.production.scrap.productionScrap(owner.connection, started.id, { quantity: 1, warehouseId: warehouse.id, locationId: location.id, unitCost: 1, reason: "Damaged component" });
  const output = await api.functional.erp.operations.production.output.productionOutput(owner.connection, scrapped.id, { quantity: 2, warehouseId: warehouse.id, locationId: location.id, unitCost: 2 });
  const submitted = await api.functional.erp.operations.production.submit.productionSubmit(owner.connection, output.id);
  const approved = await api.functional.erp.operations.production.approve.productionApprove(owner.connection, submitted.id);
  const closed = await api.functional.erp.operations.production.close.productionClose(owner.connection, approved.id);
  if (closed.status !== "closed" || closed.scrapQuantity !== 1) throw new Error("Production scrap or closure approval was not retained.");
}

/** Proves sales-return draft correction, rejection, cancellation, and linked refund. */
export async function test_api_erp_sales_return_commands(connection: api.IConnection): Promise<void> {
  const fixture = await create_owner(connection);
  const customer = await api.functional.erp.party.partyCreate(fixture.connection, { kind: "customer", name: `Return Customer ${Date.now()}`, currency: "USD" });
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(fixture.connection, { code: `SR${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(fixture.connection, { sku: `SR-${suffix}`, name: "Return Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(fixture.connection, { code: `SRW${suffix.slice(-6)}`, name: "Return Warehouse" });
  const location = await api.functional.erp.location.locationCreate(fixture.connection, { warehouseId: warehouse.id, code: "RETURN" });
  const opening = await api.functional.erp.inventory.adjustment.adjustmentCreate(fixture.connection, { itemId: item.id, warehouseId: warehouse.id, locationId: location.id, quantity: 3, unitCost: 2, reason: "Return test stock" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(fixture.connection, opening.id);
  const order = await api.functional.erp.sales.order.orderCreate(fixture.connection, { customerId: customer.id, currency: "USD", lines: [{ itemId: item.id, orderedQuantity: 3, unitPrice: 5, unitId: unit.id }] });
  const approved = await api.functional.erp.sales.order.approve.orderApprove(fixture.connection, order.id);
  const orderLine = approved.lines[0];
  if (orderLine === undefined) throw new Error("Sales order line was not returned.");
  const shipment = await api.functional.erp.sales.shipment.shipmentCreate(fixture.connection, { orderId: approved.id, lines: [{ orderLineId: orderLine.id, quantity: 3, warehouseId: warehouse.id, locationId: location.id }] });
  const posted = await api.functional.erp.sales.shipment.post.shipmentPost(fixture.connection, shipment.id);
  const shipmentLine = posted.lines[0];
  if (shipmentLine === undefined) throw new Error("Shipment line was not returned.");
  const draft = await api.functional.erp.extended_finance.sales_return.salesReturnCreate(fixture.connection, { customerId: customer.id, lines: [{ shipmentLineId: shipmentLine.id, quantity: 1, restock: true, warehouseId: warehouse.id, locationId: location.id }] });
  const revised = await api.functional.erp.extended_finance.sales_return.salesReturnUpdate(fixture.connection, draft.id, { lines: [{ shipmentLineId: shipmentLine.id, quantity: 1, restock: false, warehouseId: warehouse.id, locationId: location.id }] });
  if (revised.status !== "draft") throw new Error("Sales return draft was not editable.");
  const rejected = await api.functional.erp.extended_finance.sales_return.reject.salesReturnReject(fixture.connection, revised.id);
  if (rejected.status !== "cancelled") throw new Error("Sales return rejection was not persisted.");
  const active = await api.functional.erp.extended_finance.sales_return.salesReturnCreate(fixture.connection, { customerId: customer.id, lines: [{ shipmentLineId: shipmentLine.id, quantity: 1, restock: true, warehouseId: warehouse.id, locationId: location.id }] });
  const received = await api.functional.erp.extended_finance.sales_return.receive.salesReturnReceive(fixture.connection, await api.functional.erp.extended_finance.sales_return.approve.salesReturnApprove(fixture.connection, active.id).then((row) => row.id));
  const memo = await api.functional.erp.extended_finance.credit_memo.creditMemoCreate(fixture.connection, { customerId: customer.id, total: 5, reason: "return", salesReturnId: received.id, invoiceId: null });
  const postedMemo = await api.functional.erp.extended_finance.credit_memo.post.creditMemoPost(fixture.connection, memo.id);
  const refunded = await api.functional.erp.extended_finance.sales_return.refund.salesReturnRefund(fixture.connection, received.id, { creditMemoId: postedMemo.id });
  if (refunded.status !== "refunded") throw new Error("Sales return refund was not linked to a posted credit memo.");
  const settledMemos = await api.functional.erp.extended_finance.credit_memo.creditMemoIndex(fixture.connection, { page: 1, limit: 20 });
  if (settledMemos.data.find((row) => row.id === postedMemo.id)?.status !== "settled") throw new Error("Sales return refund did not settle the linked credit memo.");
  const cancellable = await api.functional.erp.extended_finance.sales_return.salesReturnCreate(fixture.connection, { customerId: customer.id, lines: [{ shipmentLineId: shipmentLine.id, quantity: 0.5, restock: false, warehouseId: warehouse.id, locationId: location.id }] });
  const cancelled = await api.functional.erp.extended_finance.sales_return.cancel.salesReturnCancel(fixture.connection, cancellable.id);
  if (cancelled.status !== "cancelled") throw new Error("Sales return cancellation was not persisted.");
}
