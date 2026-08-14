import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";
import { JournalProvider } from "./JournalProvider";
import { AllocationProvider } from "./AllocationProvider";

/** Organization-scoped quality holds with explicit approval and disposition. */
export namespace QuarantineProvider {
  export async function create(p: { actor: ErpPayload; body: api.IQuarantine.ICreate }): Promise<api.IQuarantine> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Warehouse Manager", "Quality Manager"], "Only an authorized quality or warehouse operator may create a quarantine.");
    if (!Number.isFinite(p.body.quantity) || p.body.quantity <= 0) throw ErrorUtil.unprocessable("Quarantine quantity must be positive and finite.");
    if (p.body.reason.trim().length === 0) throw ErrorUtil.unprocessable("A quarantine requires a reason.");
    const [inspection, item, warehouse, location] = await Promise.all([
      MyGlobal.prisma.inspections.findFirst({ where: { id: p.body.inspectionId, organization_id: organizationId, item_id: p.body.itemId } }),
      MyGlobal.prisma.items.findFirst({ where: { id: p.body.itemId, organization_id: organizationId, active: true } }),
      MyGlobal.prisma.warehouses.findFirst({ where: { id: p.body.warehouseId, organization_id: organizationId, active: true } }),
      MyGlobal.prisma.locations.findFirst({ where: { id: p.body.locationId, warehouse_id: p.body.warehouseId, active: true } }),
    ]);
    if (inspection === null) throw ErrorUtil.notFound("No matching inspection exists in the active organization.");
    if (inspection.status !== "failed" && inspection.status !== "partially_accepted") throw ErrorUtil.conflict("Only a failed inspection can create a quarantine.");
    if (inspection.rejected_quantity > 0 && p.body.quantity > inspection.rejected_quantity) throw ErrorUtil.unprocessable("Quarantine quantity cannot exceed the rejected inspection quantity.");
    if (item === null || warehouse === null || location === null) throw ErrorUtil.notFound("Quarantine item, warehouse, and location must be active in the organization.");
    const row = await MyGlobal.prisma.$transaction(async (tx) => {
      const prior = await tx.quarantines.aggregate({ _sum: { quantity: true }, where: { organization_id: organizationId, inspection_id: inspection.id, status: { in: ["pending", "approved", "rejected", "disposing", "rework"] } } });
      if (inspection.rejected_quantity > 0 && (prior._sum.quantity ?? 0) + p.body.quantity > inspection.rejected_quantity) throw ErrorUtil.conflict("Active quarantine quantity would exceed the rejected inspection quantity.");
      AllocationProvider.validateTracking(item.tracking_mode, p.body.lotId ?? null, p.body.serialCode ?? null, p.body.quantity);
      const availability = await AllocationProvider.availabilityTracking(organizationId, p.body.itemId, p.body.warehouseId, p.body.locationId, p.body.lotId ?? null, p.body.serialCode ?? null, tx);
      if (p.body.quantity > availability.available) throw ErrorUtil.conflict("Quarantine quantity exceeds available identified stock at the selected location.");
      const movements = await tx.stock_movements.findMany({ where: { organization_id: organizationId, item_id: p.body.itemId, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, ...(p.body.lotId === undefined || p.body.lotId === null ? {} : { lot_id: p.body.lotId }), ...(p.body.serialCode === undefined || p.body.serialCode === null ? {} : { serial_code: p.body.serialCode }) }, select: { quantity: true, unit_cost: true } });
      const onHand = movements.reduce((sum, movement) => sum + movement.quantity, 0);
      const unitCost = onHand > 0 ? Math.max(0, movements.reduce((sum, movement) => sum + movement.quantity * movement.unit_cost, 0) / onHand) : 0;
      const hold = await tx.quarantines.create({ data: { id: randomUUID(), organization_id: organizationId, item_id: p.body.itemId, quantity: p.body.quantity, inspection_id: inspection.id, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, reason: p.body.reason, status: "pending", decision: null, approved_by: null, approved_at: null, decision_reason: null, linked_document_id: null, created_at: new Date(), resolved_at: null } });
      await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: organizationId, item_id: hold.item_id, warehouse_id: hold.warehouse_id, location_id: hold.location_id, type: "quality_quarantine", quantity: -hold.quantity, unit_cost: unitCost, lot_id: hold.lot_id, serial_code: hold.serial_code, source_type: "quarantine", source_id: hold.id, operator_membership_id: p.actor.membership_id ?? null, created_at: hold.created_at } });
      return hold;
    });
    return dto(row);
  }

  export async function approve(p: { actor: ErpPayload; id: string }): Promise<api.IQuarantine> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Quality Manager", "Warehouse Manager"], "Only an authorized quality or warehouse operator may approve a quarantine.");
    const now = new Date();
    const changed = await MyGlobal.prisma.quarantines.updateMany({ where: { id: p.id, organization_id: organizationId, status: "pending" }, data: { status: "approved", approved_by: p.actor.membership_id!, approved_at: now } });
    if (changed.count !== 1) throw ErrorUtil.conflict("Only a pending quarantine can be approved.");
    return dto(await MyGlobal.prisma.quarantines.findUniqueOrThrow({ where: { id: p.id } }));
  }

  export async function index(p: { actor: ErpPayload; input: api.IPage.IRequest & { itemId?: string; status?: api.IQuarantine["status"] } }): Promise<api.IPage<api.IQuarantine>> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const page = p.input.page ?? 1;
    const limit = p.input.limit || 100;
    const where = { organization_id: organizationId, ...(p.input.itemId === undefined ? {} : { item_id: p.input.itemId }), ...(p.input.status === undefined ? {} : { status: p.input.status }) };
    const [rows, records] = await Promise.all([MyGlobal.prisma.quarantines.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } }), MyGlobal.prisma.quarantines.count({ where })]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(dto) };
  }

  export async function action(p: { actor: ErpPayload; id: string; action: "release" | "reject" | "rework" | "return" | "scrap" | "use_as_is"; reason?: string }): Promise<api.IQuarantine> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Quality Manager", "Warehouse Manager"], "Only an authorized quality or warehouse operator may dispose of quarantine stock.");
    const row = await MyGlobal.prisma.quarantines.findFirst({ where: { id: p.id, organization_id: organizationId, status: { in: ["approved", "rejected"] } } });
    if (row === null) throw ErrorUtil.conflict("Only an approved or rejected quarantine can receive a disposition.");
    if (row.status === "rejected" && p.action === "reject") throw ErrorUtil.conflict("The quarantine has already been rejected.");
    const reason = p.reason?.trim() || row.reason;
    const now = new Date();
    const status = p.action === "release" || p.action === "use_as_is" ? "accepted" : p.action === "reject" ? "rejected" : p.action === "rework" ? "rework" : p.action === "return" ? "returned" : "scrapped";
    const movementQuantity = p.action === "scrap" || p.action === "return" ? -row.quantity : 0;
    const inspection = await MyGlobal.prisma.inspections.findFirst({ where: { id: row.inspection_id, organization_id: organizationId } });
    if (p.action === "return" && (inspection?.source_type !== "purchase_receipt" || inspection.source_id === null)) throw ErrorUtil.conflict("Returning quarantined stock requires an inspection linked to a posted purchase receipt.");
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      const claimed = await tx.quarantines.updateMany({ where: { id: row.id, organization_id: organizationId, status: row.status }, data: { status: "disposing", decision: p.action, decision_reason: reason, approved_by: row.approved_by === null ? p.actor.membership_id! : row.approved_by, approved_at: row.approved_at === null ? now : row.approved_at } });
      if (claimed.count !== 1) throw ErrorUtil.conflict("The quarantine was already decided.");
      let linkedDocumentId: string | null = null;
      if (p.action === "return") {
        const receipt = await tx.purchase_receipts.findFirst({ where: { id: inspection!.source_id!, organization_id: organizationId, status: "posted" } });
        if (receipt === null) throw ErrorUtil.conflict("The quarantine source receipt is no longer posted.");
        const order = await tx.purchase_orders.findFirst({ where: { id: receipt.order_id, organization_id: organizationId } });
        const receiptLines = await tx.purchase_receipt_lines.findMany({ where: { receipt_id: receipt.id, warehouse_id: row.warehouse_id, location_id: row.location_id, lot_id: row.lot_id, serial_code: row.serial_code } });
        const receiptLine = receiptLines[0];
        if (order === null || receiptLine === undefined) throw ErrorUtil.conflict("The quarantine cannot resolve its purchase-receipt source line.");
        const returnLine = await tx.purchase_order_lines.findFirst({ where: { id: receiptLine.order_line_id, order_id: order.id, item_id: row.item_id } });
        if (returnLine === null) throw ErrorUtil.conflict("The quarantine source item is not present on the purchase order.");
        const priorReturned = (await tx.purchase_return_lines.aggregate({ _sum: { quantity: true }, where: { order_line_id: returnLine.id } }))._sum.quantity ?? 0;
        if (row.quantity > receiptLine.accepted_quantity - priorReturned || row.quantity > returnLine.received_quantity) throw ErrorUtil.conflict("The quarantine return exceeds the source receipt remainder.");
        linkedDocumentId = randomUUID();
        await tx.purchase_returns.create({ data: { id: linkedDocumentId, organization_id: organizationId, receipt_id: receipt.id, source_quarantine_id: row.id, number: `QRET-${Date.now()}-${randomUUID().slice(0, 6)}`, status: "posted", created_at: now, posted_at: now } });
        await tx.purchase_return_lines.create({ data: { id: randomUUID(), return_id: linkedDocumentId, order_line_id: returnLine.id, quantity: row.quantity, warehouse_id: row.warehouse_id, location_id: row.location_id, lot_id: row.lot_id, serial_code: row.serial_code, created_at: now } });
        const changed = await tx.purchase_order_lines.updateMany({ where: { id: returnLine.id, received_quantity: { gte: row.quantity } }, data: { received_quantity: { decrement: row.quantity } } });
        if (changed.count !== 1) throw ErrorUtil.conflict("The quarantine return source remainder changed while it was being posted.");
        const orderLines = await tx.purchase_order_lines.findMany({ where: { order_id: order.id }, select: { ordered_quantity: true, received_quantity: true } });
        const orderStatus = orderLines.length > 0 && orderLines.every((line) => line.received_quantity >= line.ordered_quantity) ? "received" : orderLines.some((line) => line.received_quantity > 0) ? "partial" : "sent";
        await tx.purchase_orders.update({ where: { id: order.id }, data: { status: orderStatus, updated_at: now } });
      } else if (p.action === "rework") {
        linkedDocumentId = randomUUID();
        await tx.production_orders.create({ data: { id: linkedDocumentId, organization_id: organizationId, finished_item_id: row.item_id, bom_id: null, routing_id: null, mrp_recommendation_id: null, mrp_run_id: null, source_quarantine_id: row.id, equipment_id: null, work_center_id: null, machine_id: null, planned_quantity: row.quantity, completed_quantity: 0, scrap_quantity: 0, planned_material_cost: 0, planned_labor_cost: 0, planned_machine_cost: 0, planned_overhead_cost: 0, actual_material_cost: 0, labor_hours: 0, labor_cost: 0, machine_hours: 0, machine_cost: 0, overhead_cost: 0, variance: 0, warehouse_id: row.warehouse_id, location_id: row.location_id, started_at: null, closed_at: null, status: "draft", created_at: now, updated_at: now } });
      }
      const movements = p.action === "scrap" || p.action === "return" ? await tx.stock_movements.findMany({ where: { organization_id: organizationId, item_id: row.item_id, warehouse_id: row.warehouse_id, location_id: row.location_id, lot_id: row.lot_id, serial_code: row.serial_code }, select: { quantity: true, unit_cost: true } }) : [];
      const onHand = movements.reduce((sum, movement) => sum + movement.quantity, 0);
      const weightedValue = movements.reduce((sum, movement) => sum + movement.quantity * movement.unit_cost, 0);
      const unitCost = onHand > 0 ? Math.max(0, weightedValue / onHand) : 0;
      if (movementQuantity !== 0) await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: organizationId, item_id: row.item_id, warehouse_id: row.warehouse_id, location_id: row.location_id, type: p.action === "scrap" ? "scrap" : "quality_return", quantity: movementQuantity, unit_cost: p.action === "scrap" ? unitCost : 0, lot_id: row.lot_id, serial_code: row.serial_code, source_type: linkedDocumentId === null ? "quarantine" : p.action === "return" ? "purchase_return" : "quarantine", source_id: linkedDocumentId ?? row.id, operator_membership_id: p.actor.membership_id ?? null, created_at: now } });
      if (p.action === "scrap" && row.quantity * unitCost > 0) {
        const currency = (await tx.organizations.findUniqueOrThrow({ where: { id: organizationId }, select: { base_currency: true } })).base_currency;
        await JournalProvider.createPosted(tx, organizationId, "quarantine_scrap", row.id, now, `Scrap loss for quarantine ${row.id}`, "5000", "1300", row.quantity * unitCost, currency, p.actor.membership_id);
      }
      if (p.action === "release" || p.action === "use_as_is") {
        linkedDocumentId = randomUUID();
        await tx.stock_movements.create({ data: { id: linkedDocumentId, organization_id: organizationId, item_id: row.item_id, warehouse_id: row.warehouse_id, location_id: row.location_id, type: "quality_release", quantity: row.quantity, unit_cost: unitCost, lot_id: row.lot_id, serial_code: row.serial_code, source_type: "quarantine", source_id: row.id, operator_membership_id: p.actor.membership_id ?? null, created_at: now } });
      }
      const resolved = await tx.quarantines.update({ where: { id: row.id }, data: { status, resolved_at: status === "rework" ? null : now, linked_document_id: linkedDocumentId } });
      await tx.audit_events.create({ data: { id: randomUUID(), organization_id: organizationId, actor_id: p.actor.membership_id!, action: `quality_disposition.${p.action}`, target_type: "quarantine", target_id: row.id, risk: "high", before_value: JSON.stringify({ status: row.status, decision: row.decision }), after_value: JSON.stringify({ status, decision: p.action, linkedDocumentId }), reason, ip_address: null, user_agent: null, created_at: now } });
      return resolved;
    });
    return dto(updated);
  }

  function dto(r: { id: string; inspection_id: string; item_id: string; warehouse_id: string; location_id: string; lot_id: string | null; serial_code: string | null; quantity: number; status: string; decision: string | null; approved_by: string | null; approved_at: Date | null; decision_reason: string | null; linked_document_id: string | null; reason: string; resolved_at: Date | null }): api.IQuarantine { return { id: r.id, inspectionId: r.inspection_id, itemId: r.item_id, warehouseId: r.warehouse_id, locationId: r.location_id, lotId: r.lot_id, serialCode: r.serial_code, quantity: r.quantity, status: r.status as api.IQuarantine["status"], decision: r.decision, approvedBy: r.approved_by, approvedAt: r.approved_at?.toISOString() ?? null, decisionReason: r.decision_reason, linkedDocumentId: r.linked_document_id, reason: r.reason, resolvedAt: r.resolved_at?.toISOString() ?? null }; }
}
