import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves maintenance part consumption posts stock and accumulates work-order cost. */
export async function test_api_erp_maintenance_part(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const employee = await api.functional.erp.workforce.employee.employeeCreate(owner.connection, { employeeNumber: `MP-${suffix}`, department: "Maintenance" });
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `MP${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `MP-${suffix}`, name: "Maintenance Part", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `MPW${suffix.slice(-6)}`, name: "Maintenance Warehouse" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "PARTS" });
  const opening = await api.functional.erp.inventory.adjustment.adjustmentCreate(owner.connection, { itemId: item.id, warehouseId: warehouse.id, locationId: location.id, quantity: 2, unitCost: 4, reason: "Maintenance parts" });
  await api.functional.erp.inventory.adjustment.post.adjustmentPost(owner.connection, opening.id);
  const equipment = await api.functional.erp.operations.equipment.equipmentCreate(owner.connection, { tag: `MP-EQ-${suffix}`, name: "Pump", criticality: "medium", warehouseId: warehouse.id });
  const order = await api.functional.erp.operations.maintenance.maintenanceCreate(owner.connection, { equipmentId: equipment.id, notes: "Replace filter" });
  const assigned = await api.functional.erp.operations.maintenance.assign.maintenanceAssign(owner.connection, order.id, { assigneeId: employee.id, scheduledAt: null });
  const started = await api.functional.erp.operations.maintenance.start.maintenanceStart(owner.connection, assigned.id);
  const consumed = await api.functional.erp.operations.maintenance.part.maintenancePart(owner.connection, started.id, { itemId: item.id, quantity: 1.5, warehouseId: warehouse.id, locationId: location.id, unitCost: 4 });
  if (consumed.totalCost !== 6) throw new Error("Maintenance part cost was not accumulated.");
  const balance = await api.functional.erp.stock.balance.balanceIndex(owner.connection, { page: 1, limit: 20, itemId: item.id, warehouseId: warehouse.id, locationId: location.id });
  if (balance.data[0]?.quantity !== 0.5) throw new Error("Maintenance part consumption did not post stock movement.");
}
