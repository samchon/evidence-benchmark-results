import type * as api from "@benchmark/erp-api";
import { AuthProvider } from "./AuthProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { MyGlobal } from "../MyGlobal";
import { AllocationProvider } from "./AllocationProvider";

/** Read-only inventory projections over immutable stock movements. */
export namespace StockProvider {
  type StockFilter = api.IPage.IRequest & { itemId?: null | string; warehouseId?: null | string; locationId?: null | string; lotId?: null | string; serialCode?: null | string; type?: null | string; sourceType?: null | string; sourceId?: null | string; operatorId?: null | string; from?: null | string; to?: null | string };

  export async function movementIndex(p: { actor: ErpPayload; input: StockFilter }): Promise<api.IPage<api.IStockMovement>> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const page = p.input.page ?? 1;
    const limit = p.input.limit || 100;
    const where = { organization_id: organizationId, ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}), ...(p.input.locationId ? { location_id: p.input.locationId } : {}), ...(p.input.lotId ? { lot_id: p.input.lotId } : {}), ...(p.input.serialCode ? { serial_code: p.input.serialCode } : {}), ...(p.input.type ? { type: p.input.type } : {}), ...(p.input.sourceType ? { source_type: p.input.sourceType } : {}), ...(p.input.sourceId ? { source_id: p.input.sourceId } : {}), ...(p.input.operatorId ? { operator_membership_id: p.input.operatorId } : {}), ...((p.input.from || p.input.to) ? { created_at: { ...(p.input.from ? { gte: new Date(p.input.from) } : {}), ...(p.input.to ? { lte: new Date(p.input.to) } : {}) } } : {}) };
    const [records, rows] = await Promise.all([
      MyGlobal.prisma.stock_movements.count({ where }),
      MyGlobal.prisma.stock_movements.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } }),
    ]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map((row) => ({ id: row.id, itemId: row.item_id, warehouseId: row.warehouse_id, locationId: row.location_id, lotId: row.lot_id, serialCode: row.serial_code, type: row.type, quantity: row.quantity, unitCost: row.unit_cost, sourceType: row.source_type, sourceId: row.source_id, operatorId: row.operator_membership_id, createdAt: row.created_at.toISOString() })) };
  }

  export async function balanceIndex(p: { actor: ErpPayload; input: StockFilter }): Promise<api.IPage<api.IStockBalance>> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const page = p.input.page ?? 1;
    const limit = p.input.limit || 100;
    const where = { organization_id: organizationId, ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}), ...(p.input.locationId ? { location_id: p.input.locationId } : {}), ...(p.input.lotId ? { lot_id: p.input.lotId } : {}), ...(p.input.serialCode ? { serial_code: p.input.serialCode } : {}), ...(p.input.type ? { type: p.input.type } : {}), ...(p.input.sourceType ? { source_type: p.input.sourceType } : {}), ...(p.input.sourceId ? { source_id: p.input.sourceId } : {}), ...(p.input.operatorId ? { operator_membership_id: p.input.operatorId } : {}), ...((p.input.from || p.input.to) ? { created_at: { ...(p.input.from ? { gte: new Date(p.input.from) } : {}), ...(p.input.to ? { lte: new Date(p.input.to) } : {}) } } : {}) };
    const rows = await MyGlobal.prisma.stock_movements.findMany({ where, select: { item_id: true, warehouse_id: true, location_id: true, lot_id: true, serial_code: true, quantity: true, unit_cost: true } });
    const grouped = new Map<string, { itemId: string; warehouseId: string; locationId: string; lotId: string | null; serialCode: string | null; quantity: number; weightedValue: number }>();
    for (const row of rows) { const key = `${row.item_id}:${row.warehouse_id}:${row.location_id}:${row.lot_id ?? ""}:${row.serial_code ?? ""}`; const prior = grouped.get(key); if (prior) { prior.quantity += row.quantity; prior.weightedValue += row.quantity * row.unit_cost; } else grouped.set(key, { itemId: row.item_id, warehouseId: row.warehouse_id, locationId: row.location_id, lotId: row.lot_id, serialCode: row.serial_code, quantity: row.quantity, weightedValue: row.quantity * row.unit_cost }); }
    const data = await Promise.all([...grouped.values()].slice((page - 1) * limit, page * limit).map(async (row) => {
      const availability = await AllocationProvider.availabilityTracking(organizationId, row.itemId, row.warehouseId, row.locationId, row.lotId, row.serialCode);
      return { itemId: row.itemId, warehouseId: row.warehouseId, locationId: row.locationId, lotId: row.lotId, serialCode: row.serialCode, quantity: row.quantity, onHand: availability.onHand, allocated: availability.allocated, quarantined: availability.quarantined, available: availability.available, averageUnitCost: row.quantity > 0 ? row.weightedValue / row.quantity : 0 };
    }));
    return { pagination: { current: page, limit, records: grouped.size, pages: Math.ceil(grouped.size / limit) }, data };
  }
}
