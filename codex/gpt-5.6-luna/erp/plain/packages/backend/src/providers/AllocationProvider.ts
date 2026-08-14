import type * as api from "@benchmark/erp-api";
import type { Prisma } from "@prisma/sdk";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";

/** Available-stock reservation for approved sales orders. */
export namespace AllocationProvider {
  export async function create(p: { actor: ErpPayload; body: api.IAllocation.ICreate }): Promise<api.IAllocation> {
    const organizationId = await AuthProvider.organizationId(p.actor); const now = new Date();
    if (!Number.isFinite(p.body.quantity) || p.body.quantity <= 0) throw ErrorUtil.unprocessable("An allocation quantity must be positive and finite.");
    const allocationId = randomUUID();
    let row: Awaited<ReturnType<typeof MyGlobal.prisma.stock_allocations.create>>;
    try {
      row = await MyGlobal.prisma.$transaction(async (tx) => {
      const line = await tx.sales_order_lines.findFirst({ where: { id: p.body.orderLineId } });
      if (line === null) throw ErrorUtil.conflict("Allocation requires a line on an approved sales order.");
      const order = await tx.sales_orders.findFirst({ where: { id: line.order_id, organization_id: organizationId, status: { in: ["approved", "allocated", "partial"] } } });
      if (order === null) throw ErrorUtil.conflict("Allocation requires a line on an approved sales order.");
      const warehouse = await tx.warehouses.findFirst({ where: { id: p.body.warehouseId, organization_id: organizationId, active: true } });
      const location = warehouse === null ? null : await tx.locations.findFirst({ where: { id: p.body.locationId, warehouse_id: p.body.warehouseId, active: true } });
      if (warehouse === null || location === null) throw ErrorUtil.notFound("The allocation warehouse and location must be active in the organization.");
      const item = await tx.items.findFirst({ where: { id: line.item_id, organization_id: organizationId, active: true }, select: { tracking_mode: true } });
      if (item === null) throw ErrorUtil.notFound("The allocation item is not active in the organization.");
      validateTracking(item.tracking_mode, p.body.lotId ?? null, p.body.serialCode ?? null, p.body.quantity);
      const available = await availabilityTracking(organizationId, line.item_id, p.body.warehouseId, p.body.locationId, p.body.lotId ?? null, p.body.serialCode ?? null, tx);
      const remainder = line.ordered_quantity - line.allocated_quantity - line.shipped_quantity;
      if (p.body.quantity > remainder || p.body.quantity > available.available) throw ErrorUtil.conflict("The requested allocation exceeds the order remainder or eligible available stock.");
      const created = await tx.stock_allocations.create({ data: { id: allocationId, organization_id: organizationId, order_id: order.id, order_line_id: line.id, item_id: line.item_id, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, quantity: p.body.quantity, consumed_quantity: 0, status: "active", created_at: now, updated_at: now } });
      const claimed = await tx.sales_order_lines.updateMany({ where: { id: line.id, allocated_quantity: line.allocated_quantity }, data: { allocated_quantity: { increment: p.body.quantity } } });
      if (claimed.count !== 1) throw ErrorUtil.conflict("The sales-order remainder changed while creating the allocation.");
      return created;
      }, { isolationLevel: "Serializable" });
    } catch (error) {
      if ((error as { code?: string }).code === "P2034") throw ErrorUtil.conflict("The eligible stock changed concurrently; refresh and retry the allocation.");
      throw error;
    }
    return dto(row);
  }

  export async function index(p: { actor: ErpPayload; input: api.IAllocation.IIndex }): Promise<api.IPage<api.IAllocation>> {
    const organizationId = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const where = { organization_id: organizationId, ...(p.input.orderId ? { order_id: p.input.orderId } : {}), ...(p.input.orderLineId ? { order_line_id: p.input.orderLineId } : {}), ...(p.input.status ? { status: p.input.status } : {}) };
    const [records, rows] = await Promise.all([MyGlobal.prisma.stock_allocations.count({ where }), MyGlobal.prisma.stock_allocations.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(dto) };
  }

  export async function release(p: { actor: ErpPayload; id: string }): Promise<api.IAllocation> {
    const organizationId = await AuthProvider.organizationId(p.actor); const updated = await MyGlobal.prisma.$transaction(async (tx) => { const row = await tx.stock_allocations.findFirst({ where: { id: p.id, organization_id: organizationId, status: "active", consumed_quantity: 0 } }); if (row === null) throw ErrorUtil.conflict("Only an unconsumed active allocation can be released."); const line = await tx.sales_order_lines.findFirst({ where: { id: row.order_line_id, order_id: row.order_id } }); if (line === null || line.allocated_quantity < row.quantity) throw ErrorUtil.conflict("The allocation source line is no longer eligible for release."); const changed = await tx.stock_allocations.updateMany({ where: { id: row.id, organization_id: organizationId, status: "active", consumed_quantity: 0 }, data: { status: "released", updated_at: new Date() } }); if (changed.count !== 1) throw ErrorUtil.conflict("The allocation changed while it was being released."); await tx.sales_order_lines.update({ where: { id: line.id }, data: { allocated_quantity: { decrement: row.quantity } } }); return tx.stock_allocations.findUniqueOrThrow({ where: { id: row.id } }); }); return dto(updated);
  }

  export async function availabilityAt(p: { actor: ErpPayload; body: api.IAvailability.IRequest }): Promise<api.IAvailability> { const organizationId = await AuthProvider.organizationId(p.actor); return availabilityTracking(organizationId, p.body.itemId, p.body.warehouseId, p.body.locationId, p.body.lotId ?? null, p.body.serialCode ?? null); }
  export async function availability(organizationId: string, itemId: string, warehouseId: string, locationId: string): Promise<api.IAvailability> { return availabilityTracking(organizationId, itemId, warehouseId, locationId, null, null); }
  async function availabilityBase(client: Prisma.TransactionClient | typeof MyGlobal.prisma, organizationId: string, itemId: string, warehouseId: string, locationId: string, lotId: string | null, serialCode: string | null): Promise<api.IAvailability> { const tracking = { ...(lotId !== null ? { lot_id: lotId } : {}), ...(serialCode !== null ? { serial_code: serialCode } : {}) }; const movements = await client.stock_movements.findMany({ where: { organization_id: organizationId, item_id: itemId, warehouse_id: warehouseId, location_id: locationId, ...tracking }, select: { quantity: true } }); const active = await client.stock_allocations.findMany({ where: { organization_id: organizationId, item_id: itemId, warehouse_id: warehouseId, location_id: locationId, status: "active", ...tracking }, select: { quantity: true, consumed_quantity: true } }); const productionActive = lotId === null && serialCode === null ? await client.production_reservations.findMany({ where: { organization_id: organizationId, item_id: itemId, warehouse_id: warehouseId, location_id: locationId, status: "active" }, select: { quantity: true, consumed_quantity: true } }) : []; const quarantine = await client.quarantines.findMany({ where: { organization_id: organizationId, item_id: itemId, warehouse_id: warehouseId, location_id: locationId, status: { in: ["pending", "approved", "rejected", "rework", "disposing"] }, ...tracking }, select: { quantity: true } }); const quarantined = quarantine.reduce((sum, row) => sum + row.quantity, 0); const onHand = movements.reduce((sum, row) => sum + row.quantity, 0) + quarantined; const allocated = active.reduce((sum, row) => sum + row.quantity - row.consumed_quantity, 0) + productionActive.reduce((sum, row) => sum + row.quantity - row.consumed_quantity, 0); return { itemId, warehouseId, locationId, lotId, serialCode, onHand, allocated, quarantined, available: Math.max(0, onHand - allocated - quarantined) }; }
  export async function availabilityOn(client: Prisma.TransactionClient, organizationId: string, itemId: string, warehouseId: string, locationId: string): Promise<api.IAvailability> { return availabilityBase(client, organizationId, itemId, warehouseId, locationId, null, null); }
  export async function availabilityTracking(organizationId: string, itemId: string, warehouseId: string, locationId: string, lotId: string | null, serialCode: string | null, client: Prisma.TransactionClient | typeof MyGlobal.prisma = MyGlobal.prisma): Promise<api.IAvailability> {
    return availabilityBase(client, organizationId, itemId, warehouseId, locationId, lotId, serialCode);
  }
  export function validateTracking(mode: string, lotId: string | null, serialCode: string | null, quantity = 1): void { if (mode === "lot" && (lotId === null || serialCode !== null)) throw ErrorUtil.conflict("A lot-tracked stock operation requires only a lot."); if (mode === "serial" && (quantity !== 1 || serialCode === null || lotId !== null)) throw ErrorUtil.conflict("A serial-tracked stock operation requires one serial per unit."); if (mode === "none" && (lotId !== null || serialCode !== null)) throw ErrorUtil.unprocessable("An untracked stock operation cannot carry tracking evidence."); }
  function dto(row: { id: string; order_id: string; order_line_id: string; item_id: string; warehouse_id: string; location_id: string; lot_id: string | null; serial_code: string | null; quantity: number; consumed_quantity: number; status: string }): api.IAllocation { return { id: row.id, orderId: row.order_id, orderLineId: row.order_line_id, itemId: row.item_id, warehouseId: row.warehouse_id, locationId: row.location_id, lotId: row.lot_id, serialCode: row.serial_code, quantity: row.quantity, consumedQuantity: row.consumed_quantity, status: row.status as api.IAllocation["status"] }; }
}
