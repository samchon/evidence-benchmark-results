import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves production scheduling is blocked by dependent equipment downtime. */
export async function test_api_erp_production_equipment_downtime(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const employee = await api.functional.erp.workforce.employee.employeeCreate(owner.connection, { employeeNumber: `PD-${suffix}`, department: "Maintenance" });
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `PD${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `PD-${suffix}`, name: "Production Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const equipment = await api.functional.erp.operations.equipment.equipmentCreate(owner.connection, { tag: `PD-EQ-${suffix}`, name: "Critical Line", criticality: "high" });
  const maintenance = await api.functional.erp.operations.maintenance.maintenanceCreate(owner.connection, { equipmentId: equipment.id, notes: "Down for repair" });
  const assigned = await api.functional.erp.operations.maintenance.assign.maintenanceAssign(owner.connection, maintenance.id, { assigneeId: employee.id, scheduledAt: null });
  await api.functional.erp.operations.maintenance.start.maintenanceStart(owner.connection, assigned.id);
  const production = await api.functional.erp.operations.production.productionCreate(owner.connection, { finishedItemId: item.id, equipmentId: equipment.id, plannedQuantity: 1 });
  let blocked = false;
  try { await api.functional.erp.operations.production.release.productionRelease(owner.connection, production.id); } catch { blocked = true; }
  if (!blocked) throw new Error("Production was released while its critical equipment was down.");
  await api.functional.erp.operations.maintenance.complete.maintenanceComplete(owner.connection, maintenance.id, { notes: "Repair complete" });
  const released = await api.functional.erp.operations.production.release.productionRelease(owner.connection, production.id);
  if (released.status !== "released" || released.equipmentId !== equipment.id) throw new Error("Production did not become schedulable after equipment recovery.");
}
