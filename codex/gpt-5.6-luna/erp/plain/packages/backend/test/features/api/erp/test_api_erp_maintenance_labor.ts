import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves started-work labor and downtime commands and cost-center posting. */
export async function test_api_erp_maintenance_labor(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const employee = await api.functional.erp.workforce.employee.employeeCreate(owner.connection, { employeeNumber: `ML-${suffix}`, department: "Maintenance" });
  const center = await api.functional.erp.financial_center.cost.costCreate(owner.connection, { code: `ML${suffix.slice(-6)}`, name: "Maintenance Cost" });
  const equipment = await api.functional.erp.operations.equipment.equipmentCreate(owner.connection, { tag: `ML-EQ-${suffix}`, name: "Compressor", criticality: "high" });
  const order = await api.functional.erp.operations.maintenance.maintenanceCreate(owner.connection, { equipmentId: equipment.id, notes: "Inspect compressor", costCenterId: center.id, laborRate: 12 });
  const assigned = await api.functional.erp.operations.maintenance.assign.maintenanceAssign(owner.connection, order.id, { assigneeId: employee.id, scheduledAt: null });
  const started = await api.functional.erp.operations.maintenance.start.maintenanceStart(owner.connection, assigned.id);
  const labor = await api.functional.erp.operations.maintenance.labor.maintenanceLabor(owner.connection, started.id, { hours: 2 });
  const downtime = await api.functional.erp.operations.maintenance.downtime.maintenanceDowntime(owner.connection, started.id, { hours: 1.5 });
  if (labor.laborHours !== 2 || labor.totalCost !== 24 || downtime.downtimeHours !== 1.5) throw new Error("Maintenance labor or downtime was not accumulated.");
  const completed = await api.functional.erp.operations.maintenance.complete.maintenanceComplete(owner.connection, started.id, { notes: "Compressor serviced." });
  const posted = await api.functional.erp.operations.maintenance.labor.post.maintenanceLaborPost(owner.connection, completed.id, { costCenterId: center.id });
  if (posted.costCenterId !== center.id || !posted.laborPosted || posted.notes !== "Compressor serviced.") throw new Error("Maintenance labor was not posted to its cost center.");
}
