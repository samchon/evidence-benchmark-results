import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";
import { JournalProvider } from "./JournalProvider";
import { AllocationProvider } from "./AllocationProvider";
import { ControlOperationsProvider } from "./ControlOperationsProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import type { assets, equipment as EquipmentRow, inspections, maintenance_orders, production_orders, service_cases } from "../prisma/client";
type OpsId = { actor: ErpPayload; id: string }; type OpsBody<T> = { actor: ErpPayload; body: T }; type OpsIdBody<T> = OpsId & { body: T }; type OpsInput<T> = { actor: ErpPayload; input: T }; type InspectionFinalize = OpsId & { status: "passed" | "failed" | "waived" }; type EquipmentIndexInput = api.IPage.IRequest & { status?: api.IEquipment["status"]; criticality?: api.IEquipment["criticality"]; warehouseId?: string }; type MaintenanceAssignment = OpsId & { body: { assigneeId: string; scheduledAt?: null | string } }; type ServiceIndexInput = api.IServiceCase.IIndex; type ServiceState = OpsId & { status: "investigating" | "waiting" | "resolved" | "closed" | "cancelled"; resolution?: string | null }; type AssetRow = assets; type ProductionRow = production_orders; type InspectionRow = inspections; type EquipmentDbRow = EquipmentRow; type MaintenanceRow = maintenance_orders; type ServiceRow = service_cases;
/** Fixed asset, manufacturing, quality, maintenance, and service primitives. */
export namespace OperationsProvider {
    export async function assetCreate(p: OpsBody<api.IAsset.ICreate>) { const org = await AuthProvider.organizationId(p.actor); return asset(await MyGlobal.prisma.assets.create({ data: { id: randomUUID(), organization_id: org, tag: p.body.tag, name: p.body.name, acquisition_cost: p.body.acquisitionCost, source_type: p.body.sourceType ?? "manual", source_id: p.body.sourceId ?? null, residual_value: p.body.residualValue, useful_life_months: p.body.usefulLifeMonths, depreciation_method: p.body.depreciationMethod, status: "draft", custodian_id: null, location_id: null, created_at: new Date(), updated_at: new Date() } })); }
    export async function assetIndex(p: OpsInput<api.IPage.IRequest>) { const org = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const where = { organization_id: org }; const [records, rows] = await Promise.all([MyGlobal.prisma.assets.count({ where }), MyGlobal.prisma.assets.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { tag: "asc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(asset) }; }
    export async function assetUpdate(p: OpsIdBody<api.IAsset.IUpdate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.assets.findFirst({ where: { id: p.id, organization_id: org } });
        if (row === null)
            throw ErrorUtil.notFound("No asset exists in the active organization.");
        if (p.body.status === "active" && row.status === "draft") {
            const submitted = await assetSubmit({ actor: p.actor, id: row.id, body: { reason: "Capitalization submission" } });
            return submitted.status === "approved" ? assetActivate({ actor: p.actor, id: row.id }) : submitted;
        }
        if (p.body.status !== undefined && p.body.status !== row.status)
            throw ErrorUtil.conflict("Asset lifecycle changes must use capitalization submission or activation commands.");
        return asset(await MyGlobal.prisma.assets.update({ where: { id: row.id }, data: { name: p.body.name ?? row.name, updated_at: new Date() } }));
    }
    export async function assetSubmit(p: OpsIdBody<api.IAsset.ISubmit>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.assets.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft asset can be submitted for capitalization.");
        if (p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("Asset capitalization requires a reason.");
        const organization = await MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: org }, select: { approval_threshold: true } });
        if (row.acquisition_cost <= organization.approval_threshold)
            return asset(await MyGlobal.prisma.assets.update({ where: { id: row.id }, data: { status: "approved", updated_at: new Date() } }));
        await ControlOperationsProvider.approvalCreate({ actor: p.actor, body: { targetType: "asset_capitalization", targetId: row.id } });
        return asset(await MyGlobal.prisma.assets.update({ where: { id: row.id }, data: { status: "pending", updated_at: new Date() } }));
    }
    export async function assetActivate(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.assets.findFirst({ where: { id: p.id, organization_id: org, status: "approved" } });
        if (row !== null)
            return asset(await MyGlobal.prisma.assets.update({ where: { id: row.id }, data: { status: "active", updated_at: new Date() } }));
        const approval = await MyGlobal.prisma.approvals.findFirst({ where: { organization_id: org, target_type: "asset_capitalization", target_id: p.id, status: "approved" } });
        if (approval === null)
            throw ErrorUtil.conflict("Only an approved asset capitalization can be activated.");
        const pending = await MyGlobal.prisma.assets.findFirst({ where: { id: p.id, organization_id: org, status: "pending" } });
        if (pending === null)

            throw ErrorUtil.conflict("Only a pending asset capitalization can be activated.");
        return asset(await MyGlobal.prisma.assets.update({ where: { id: pending.id }, data: { status: "active", updated_at: new Date() } }));
    }
    export async function productionCreate(p: OpsBody<api.IProductionOrder.ICreate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const item = await MyGlobal.prisma.items.findFirst({ where: { id: p.body.finishedItemId, organization_id: org, type: "inventory", active: true } });
        if (item === null)
            throw ErrorUtil.unprocessable("Production requires an active inventory item.");
        if (p.body.plannedQuantity <= 0)
            throw ErrorUtil.unprocessable("Production planned quantity must be positive.");
        await validateLocation(org, p.body.warehouseId, p.body.locationId);
        if (p.body.bomId !== undefined && p.body.bomId !== null && await MyGlobal.prisma.boms.findFirst({ where: { id: p.body.bomId, organization_id: org, finished_item_id: item.id, status: "active" } }) === null)
            throw ErrorUtil.conflict("New production may select only an active BOM for its finished item.");
        if (p.body.routingId !== undefined && p.body.routingId !== null && await MyGlobal.prisma.routings.findFirst({ where: { id: p.body.routingId, organization_id: org, finished_item_id: item.id, status: "active" } }) === null)
            throw ErrorUtil.conflict("New production may select only an active routing for its finished item.");
        if (p.body.equipmentId !== undefined && p.body.equipmentId !== null && await MyGlobal.prisma.equipment.findFirst({ where: { id: p.body.equipmentId, organization_id: org, status: { not: "retired" } } }) === null)
            throw ErrorUtil.notFound("No eligible equipment exists in the active organization.");
        if (p.body.workCenterId !== undefined && p.body.workCenterId !== null && await MyGlobal.prisma.work_centers.findFirst({ where: { id: p.body.workCenterId, organization_id: org, status: "active" } }) === null)
            throw ErrorUtil.notFound("No active work center exists in the active organization.");
        if (p.body.machineId !== undefined && p.body.machineId !== null && await MyGlobal.prisma.machines.findFirst({ where: { id: p.body.machineId, organization_id: org, status: "active", ...(p.body.workCenterId ? { work_center_id: p.body.workCenterId } : {}) } }) === null)
            throw ErrorUtil.notFound("No active machine exists in the selected work center.");
        return production(await MyGlobal.prisma.production_orders.create({ data: { id: randomUUID(), organization_id: org, finished_item_id: item.id, equipment_id: p.body.equipmentId ?? null, work_center_id: p.body.workCenterId ?? null, machine_id: p.body.machineId ?? null, bom_id: p.body.bomId ?? null, routing_id: p.body.routingId ?? null, planned_quantity: p.body.plannedQuantity, completed_quantity: 0, scrap_quantity: 0, planned_material_cost: p.body.plannedMaterialCost ?? 0, planned_labor_cost: p.body.plannedLaborCost ?? 0, planned_machine_cost: p.body.plannedMachineCost ?? 0, planned_overhead_cost: p.body.plannedOverheadCost ?? 0, actual_material_cost: 0, labor_hours: 0, labor_cost: 0, machine_hours: 0, machine_cost: 0, overhead_cost: 0, variance: 0, warehouse_id: p.body.warehouseId ?? null, location_id: p.body.locationId ?? null, started_at: null, closed_at: null, status: "draft", created_at: new Date(), updated_at: new Date() } }));
    }
    export async function productionIndex(p: OpsInput<api.IPage.IRequest>) { const org = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const where = { organization_id: org }; const [records, rows] = await Promise.all([MyGlobal.prisma.production_orders.count({ where }), MyGlobal.prisma.production_orders.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(production) }; }
    export async function productionUpdate(p: OpsIdBody<api.IProductionOrder.IUpdate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft production order can be edited.");
        if (p.body.plannedQuantity !== undefined && p.body.plannedQuantity < row.completed_quantity + row.scrap_quantity)
            throw ErrorUtil.conflict("Planned quantity cannot be below completed and scrap quantities.");
        if (p.body.equipmentId !== undefined && p.body.equipmentId !== null && await MyGlobal.prisma.equipment.findFirst({ where: { id: p.body.equipmentId, organization_id: org, status: { not: "retired" } } }) === null)
            throw ErrorUtil.notFound("No eligible equipment exists in the active organization.");
        if (p.body.workCenterId !== undefined && p.body.workCenterId !== null && await MyGlobal.prisma.work_centers.findFirst({ where: { id: p.body.workCenterId, organization_id: org, status: "active" } }) === null)
            throw ErrorUtil.notFound("No active work center exists in the active organization.");
        if (p.body.machineId !== undefined && p.body.machineId !== null && await MyGlobal.prisma.machines.findFirst({ where: { id: p.body.machineId, organization_id: org, status: "active", ...(p.body.workCenterId ? { work_center_id: p.body.workCenterId } : {}) } }) === null)
            throw ErrorUtil.notFound("No active machine exists in the selected work center.");
        if (p.body.bomId !== undefined && p.body.bomId !== null && await MyGlobal.prisma.boms.findFirst({ where: { id: p.body.bomId, organization_id: org, finished_item_id: row.finished_item_id, status: "active" } }) === null)
            throw ErrorUtil.conflict("Draft production may select only an active BOM for its finished item.");
        if (p.body.routingId !== undefined && p.body.routingId !== null && await MyGlobal.prisma.routings.findFirst({ where: { id: p.body.routingId, organization_id: org, finished_item_id: row.finished_item_id, status: "active" } }) === null)
            throw ErrorUtil.conflict("Draft production may select only an active routing for its finished item.");
        const warehouseId = p.body.warehouseId === undefined ? row.warehouse_id : p.body.warehouseId;
        const locationId = p.body.locationId === undefined ? row.location_id : p.body.locationId;
        if ((warehouseId === null) !== (locationId === null))
            throw ErrorUtil.conflict("Production issue warehouse and location must be selected together.");
        if (warehouseId !== null && locationId !== null)
            await validateLocation(org, warehouseId, locationId);
        return production(await MyGlobal.prisma.production_orders.update({ where: { id: row.id }, data: { equipment_id: p.body.equipmentId === undefined ? undefined : p.body.equipmentId, work_center_id: p.body.workCenterId === undefined ? undefined : p.body.workCenterId, machine_id: p.body.machineId === undefined ? undefined : p.body.machineId, planned_quantity: p.body.plannedQuantity ?? row.planned_quantity, planned_material_cost: p.body.plannedMaterialCost ?? undefined, planned_labor_cost: p.body.plannedLaborCost ?? undefined, planned_machine_cost: p.body.plannedMachineCost ?? undefined, planned_overhead_cost: p.body.plannedOverheadCost ?? undefined, bom_id: p.body.bomId === undefined ? undefined : p.body.bomId, routing_id: p.body.routingId === undefined ? undefined : p.body.routingId, warehouse_id: p.body.warehouseId === undefined ? undefined : p.body.warehouseId, location_id: p.body.locationId === undefined ? undefined : p.body.locationId, updated_at: new Date() } }));
    }
    export async function productionRelease(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org } });
        if (row === null)
            throw ErrorUtil.notFound("No production order exists in the active organization.");
        if (row.status !== "draft")
            throw ErrorUtil.conflict("Only a draft production order can be released.");

        if (row.equipment_id !== null) {
            const equipment = await MyGlobal.prisma.equipment.findUnique({ where: { id: row.equipment_id } });
            if (equipment?.status === "maintenance" || equipment?.status === "out_of_service")
                throw ErrorUtil.conflict("Production cannot be scheduled while its equipment is down.");
        }
        const released = await MyGlobal.prisma.$transaction(async (tx) => {
            const claimed = await tx.production_orders.updateMany({ where: { id: row.id, organization_id: org, status: "draft" }, data: { status: "released", updated_at: new Date() } });
            if (claimed.count !== 1)
                throw ErrorUtil.conflict("The production order changed while it was being released.");
            if (row.bom_id !== null) {
                if (row.warehouse_id === null || row.location_id === null)
                    throw ErrorUtil.conflict("A production order with components requires an issue warehouse and location.");
                const lines = await tx.bom_lines.findMany({ where: { bom_id: row.bom_id } });
                const organization = await tx.organizations.findUniqueOrThrow({ where: { id: org }, select: { negative_stock_allowed: true } });
                for (const line of lines) {
                    const quantity = line.quantity * row.planned_quantity;
                    const available = await AllocationProvider.availabilityOn(tx, org, line.item_id, row.warehouse_id, row.location_id);
                    if (!organization.negative_stock_allowed && available.available < quantity)
                        throw ErrorUtil.conflict("Production release exceeds eligible component availability.");
                    await tx.production_reservations.create({ data: { id: randomUUID(), organization_id: org, production_order_id: row.id, item_id: line.item_id, warehouse_id: row.warehouse_id, location_id: row.location_id, quantity, consumed_quantity: 0, status: "active", created_at: new Date(), updated_at: new Date() } });
                }
            }
            return tx.production_orders.findUniqueOrThrow({ where: { id: row.id } });
        });
        return OperationsProvider.production(released);
    }
    export async function productionStart(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "released" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a released production order can start.");
        if (row.equipment_id !== null) {
            const equipment = await MyGlobal.prisma.equipment.findUnique({ where: { id: row.equipment_id } });
            if (equipment?.status === "maintenance" || equipment?.status === "out_of_service")
                throw ErrorUtil.conflict("Production cannot start while its equipment is down.");
        }
        return production(await MyGlobal.prisma.production_orders.update({ where: { id: row.id }, data: { status: "in_progress", started_at: new Date(), updated_at: new Date() } }));
    }
    export async function productionOutput(p: OpsIdBody<api.IProductionOrder.IOutput>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress production order can receive output.");
        if (p.body.quantity <= 0)
            throw ErrorUtil.unprocessable("Production output quantity must be positive.");
        await validateLocation(org, p.body.warehouseId, p.body.locationId);
        const item = await MyGlobal.prisma.items.findFirst({ where: { id: row.finished_item_id, organization_id: org, active: true } });
        if (item === null)
            throw ErrorUtil.notFound("No active finished item exists in the organization.");
        AllocationProvider.validateTracking(item.tracking_mode, p.body.lotId ?? null, p.body.serialCode ?? null, p.body.quantity);
        if (row.completed_quantity + row.scrap_quantity + p.body.quantity > row.planned_quantity)
            throw ErrorUtil.conflict("Production output exceeds the planned quantity.");
        const now = new Date();
        const updated = await MyGlobal.prisma.$transaction(async (tx) => { await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: org, item_id: row.finished_item_id, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, type: "production", quantity: p.body.quantity, unit_cost: p.body.unitCost, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, source_type: "production_order", source_id: row.id, operator_membership_id: p.actor.membership_id ?? null, created_at: now } }); return tx.production_orders.update({ where: { id: row.id }, data: { completed_quantity: { increment: p.body.quantity }, status: row.completed_quantity + row.scrap_quantity + p.body.quantity >= row.planned_quantity ? "completed" : "in_progress", warehouse_id: p.body.warehouseId, location_id: p.body.locationId, updated_at: now } }); });
        return production(updated);
    }
    export async function productionConsume(p: OpsIdBody<api.IProductionOrder.IConsume>) {

        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress production order can consume components.");
        if (p.body.quantity <= 0)
            throw ErrorUtil.unprocessable("Production consumption quantity must be positive.");
        await validateLocation(org, p.body.warehouseId, p.body.locationId);
        const item = await MyGlobal.prisma.items.findFirst({ where: { id: p.body.itemId, organization_id: org, active: true, type: { not: "service" } }, select: { tracking_mode: true } });
        if (item === null)
            throw ErrorUtil.notFound("No active component item exists in the organization.");
        AllocationProvider.validateTracking(item.tracking_mode, p.body.lotId ?? null, p.body.serialCode ?? null, p.body.quantity);
        const now = new Date();
        const available = await AllocationProvider.availabilityTracking(org, p.body.itemId, p.body.warehouseId, p.body.locationId, p.body.lotId ?? null, p.body.serialCode ?? null);
        if (available.available < p.body.quantity)
            throw ErrorUtil.conflict("Production consumption exceeds eligible available stock.");
        await MyGlobal.prisma.stock_movements.create({ data: { id: randomUUID(), organization_id: org, item_id: p.body.itemId, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, type: "production", quantity: -p.body.quantity, unit_cost: p.body.unitCost, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, source_type: "production_order", source_id: row.id, operator_membership_id: p.actor.membership_id ?? null, created_at: now } });
        return production(row);
    }
    export async function productionScrap(p: OpsIdBody<api.IProductionOrder.IScrap>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress production order can record scrap.");
        if (p.body.quantity <= 0)
            throw ErrorUtil.unprocessable("Production scrap quantity must be positive.");
        await validateLocation(org, p.body.warehouseId, p.body.locationId);
        const item = await MyGlobal.prisma.items.findFirst({ where: { id: row.finished_item_id, organization_id: org, active: true } });
        if (item === null)
            throw ErrorUtil.notFound("No active finished item exists in the organization.");
        AllocationProvider.validateTracking(item.tracking_mode, p.body.lotId ?? null, p.body.serialCode ?? null, p.body.quantity);
        if (p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("Production scrap requires a reason.");
        if (row.completed_quantity + row.scrap_quantity + p.body.quantity > row.planned_quantity)
            throw ErrorUtil.conflict("Production scrap exceeds the planned quantity.");
        const now = new Date();
        const updated = await MyGlobal.prisma.$transaction(async (tx) => { await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: org, item_id: row.finished_item_id, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, type: "production_scrap", quantity: -p.body.quantity, unit_cost: p.body.unitCost, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, source_type: "production_order", source_id: row.id, operator_membership_id: p.actor.membership_id ?? null, created_at: now } }); return tx.production_orders.update({ where: { id: row.id }, data: { scrap_quantity: { increment: p.body.quantity }, updated_at: now } }); });
        return production(updated);
    }
    export async function productionLabor(p: OpsIdBody<api.IProductionOrder.ILabor>) {
        const org = await AuthProvider.organizationId(p.actor);
        if (!Number.isFinite(p.body.hours) || p.body.hours <= 0 || !Number.isFinite(p.body.rate) || p.body.rate < 0)
            throw ErrorUtil.unprocessable("Production labor requires positive hours and a non-negative rate.");
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress production order can record labor.");
        if (p.body.employeeId !== undefined && p.body.employeeId !== null && await MyGlobal.prisma.employees.findFirst({ where: { id: p.body.employeeId, organization_id: org, status: "active" } }) === null)
            throw ErrorUtil.notFound("The labor employee is not active in the organization.");
        return production(await MyGlobal.prisma.production_orders.update({ where: { id: row.id }, data: { labor_hours: { increment: p.body.hours }, labor_cost: { increment: p.body.hours * p.body.rate }, updated_at: new Date() } }));
    }
    export async function productionMachineTime(p: OpsIdBody<api.IProductionOrder.IMachineTime>) {
        const org = await AuthProvider.organizationId(p.actor);
        if (!Number.isFinite(p.body.hours) || p.body.hours <= 0 || !Number.isFinite(p.body.rate) || p.body.rate < 0)
            throw ErrorUtil.unprocessable("Production machine time requires positive hours and a non-negative rate.");
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress production order can record machine time.");
        if (p.body.machineId !== undefined && p.body.machineId !== null && await MyGlobal.prisma.machines.findFirst({ where: { id: p.body.machineId, organization_id: org, status: "active" } }) === null)

            throw ErrorUtil.notFound("The machine is not active in the organization.");
        if (p.body.machineId !== undefined && p.body.machineId !== null && row.machine_id !== p.body.machineId)
            throw ErrorUtil.conflict("Machine time must use the machine assigned to the production order.");
        return production(await MyGlobal.prisma.production_orders.update({ where: { id: row.id }, data: { machine_hours: { increment: p.body.hours }, machine_cost: { increment: p.body.hours * p.body.rate }, updated_at: new Date() } }));
    }
    export async function productionOverhead(p: OpsIdBody<api.IProductionOrder.IOverhead>) {
        const org = await AuthProvider.organizationId(p.actor);
        if (!Number.isFinite(p.body.amount) || p.body.amount < 0 || p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("Production overhead requires a non-negative amount and a reason.");
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress production order can record overhead.");
        return production(await MyGlobal.prisma.production_orders.update({ where: { id: row.id }, data: { overhead_cost: { increment: p.body.amount }, updated_at: new Date() } }));
    }
    export async function productionSubmit(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "completed" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a completed production order can be submitted for closure.");
        await validateProductionEvidence(org, row.id, row.planned_quantity, row.completed_quantity, row.scrap_quantity);
        return production(await MyGlobal.prisma.production_orders.update({ where: { id: row.id }, data: { status: "pending_approval", updated_at: new Date() } }));
    }
    export async function productionApprove(p: OpsId) { return productionState(p, "pending_approval", "approved"); }
    export async function productionReject(p: OpsId) { return productionState(p, "pending_approval", "completed"); }
    export async function productionClose(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "approved" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an approved production order can close.");
        await validateProductionEvidence(org, row.id, row.planned_quantity, row.completed_quantity, row.scrap_quantity);
        const now = new Date();
        const closed = await MyGlobal.prisma.$transaction(async (tx) => {
            const movements = await tx.stock_movements.findMany({ where: { organization_id: org, source_type: "production_order", source_id: row.id }, select: { quantity: true, unit_cost: true } });
            const materialCost = movements.filter((movement) => movement.quantity < 0).reduce((sum, movement) => sum + Math.abs(movement.quantity) * movement.unit_cost, 0);
            const outputCost = movements.filter((movement) => movement.quantity > 0).reduce((sum, movement) => sum + movement.quantity * movement.unit_cost, 0);
            const actualCost = materialCost + row.labor_cost + row.machine_cost + row.overhead_cost;
            const variance = Math.abs(outputCost - actualCost);
            if (variance > 0) {
                const organization = await tx.organizations.findUniqueOrThrow({ where: { id: org }, select: { base_currency: true } });
                await JournalProvider.createPosted(tx, org, "production_variance", row.id, now, `Manufacturing variance for production order ${row.id}`, "5000", "6000", variance, organization.base_currency);
            }
            return tx.production_orders.update({ where: { id: row.id }, data: { actual_material_cost: materialCost, variance, status: "closed", closed_at: now, updated_at: now } });
        });
        return production(closed);
    }
    async function productionState(p: OpsId, expected: string, status: string) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: expected } });
        if (row === null)
            throw ErrorUtil.conflict(`Only a ${expected} production order can become ${status}.`);
        return production(await MyGlobal.prisma.production_orders.update({ where: { id: row.id }, data: { status, updated_at: new Date() } }));
    }
    async function validateProductionEvidence(organizationId: string, productionOrderId: string, plannedQuantity: number, completedQuantity: number, scrapQuantity: number) {
        if (completedQuantity + scrapQuantity < plannedQuantity)

            throw ErrorUtil.conflict("Production closure requires the planned quantity to be completed or scrapped.");
        const activeReservations = await MyGlobal.prisma.production_reservations.findMany({ where: { organization_id: organizationId, production_order_id: productionOrderId, status: "active" }, select: { quantity: true, consumed_quantity: true } });
        if (activeReservations.some((reservation) => reservation.quantity > reservation.consumed_quantity))
            throw ErrorUtil.conflict("Production closure is blocked by unresolved component reservations.");
        const inspections = await MyGlobal.prisma.inspections.count({ where: { organization_id: organizationId, source_type: "production", source_id: productionOrderId, status: { notIn: ["passed", "waived", "partially_accepted"] } } });
        if (inspections > 0)
            throw ErrorUtil.conflict("Production closure is blocked by unresolved quality inspections.");
    }
    async function validateLocation(organizationId: string, warehouseId: string | null | undefined, locationId: string | null | undefined) {
        if (warehouseId === undefined || warehouseId === null || locationId === undefined || locationId === null) {
            if (warehouseId !== locationId)
                throw ErrorUtil.unprocessable("A warehouse and location must be supplied together.");
            return;
        }
        const warehouse = await MyGlobal.prisma.warehouses.findFirst({ where: { id: warehouseId, organization_id: organizationId, active: true } });
        const location = await MyGlobal.prisma.locations.findFirst({ where: { id: locationId, warehouse_id: warehouseId, active: true } });
        if (warehouse === null || location === null)
            throw ErrorUtil.notFound("The warehouse and location must be active in the organization.");
    }
    export async function productionCancel(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["draft", "released"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft or released production order can be cancelled.");
        const now = new Date();
        return production(await MyGlobal.prisma.$transaction(async (tx) => { const updated = await tx.production_orders.update({ where: { id: row.id }, data: { status: "cancelled", updated_at: now } }); await tx.production_reservations.updateMany({ where: { production_order_id: row.id, organization_id: org, status: "active", consumed_quantity: 0 }, data: { status: "released", updated_at: now } }); return updated; }));
    }
    export async function inspectionCreate(p: OpsBody<api.IInspection.ICreate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const item = await MyGlobal.prisma.items.findFirst({ where: { id: p.body.itemId, organization_id: org, active: true } });
        if (item === null)
            throw ErrorUtil.notFound("No active item exists in the active organization.");
        const plan = p.body.inspectionPlanId === undefined || p.body.inspectionPlanId === null ? null : await MyGlobal.prisma.inspection_plans.findFirst({ where: { id: p.body.inspectionPlanId, organization_id: org, item_id: item.id, status: "active" } });
        if (p.body.inspectionPlanId !== undefined && p.body.inspectionPlanId !== null && plan === null)
            throw ErrorUtil.notFound("No active inspection plan exists for the item.");
        return inspection(await MyGlobal.prisma.inspections.create({ data: { id: randomUUID(), organization_id: org, source_type: p.body.sourceType ?? null, source_id: p.body.sourceId ?? null, item_id: p.body.itemId, inspection_plan_id: plan?.id ?? null, status: "pending", reason: null, created_at: new Date(), finalized_at: null } }));
    }
    export async function inspectionStart(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.inspections.findFirst({ where: { id: p.id, organization_id: org, status: "pending" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a pending inspection can be started.");
        return inspection(await MyGlobal.prisma.inspections.update({ where: { id: row.id }, data: { status: "in_progress" } }));
    }
    export async function inspectionResults(p: OpsIdBody<api.IInspection.IResults>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.inspections.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress inspection can record results.");
        return inspection(await MyGlobal.prisma.inspections.update({ where: { id: row.id }, data: { reason: JSON.stringify(p.body.results) } }));
    }
    export async function inspectionPartialAccept(p: OpsIdBody<api.IInspection.IPartialAcceptance>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.inspections.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress", finalized_at: null } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress inspection can be partially accepted.");

        if (p.body.acceptedQuantity <= 0 || p.body.rejectedQuantity <= 0)
            throw ErrorUtil.unprocessable("Partial acceptance requires positive accepted and rejected quantities.");
        if (p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("Partial acceptance requires a reason.");
        let priorResults: Record<string, unknown> = {};
        if (row.reason !== null) {
            try {
                const parsed = JSON.parse(row.reason);
                priorResults = parsed.results ?? parsed;
            }
            catch { /* the prior value is a human note */ }
        }
        return inspection(await MyGlobal.prisma.inspections.update({ where: { id: row.id }, data: { status: "partially_accepted", reason: JSON.stringify({ results: priorResults, reason: p.body.reason }), accepted_quantity: p.body.acceptedQuantity, rejected_quantity: p.body.rejectedQuantity, finalized_at: new Date() } }));
    }
    export async function inspectionFinalize(p: InspectionFinalize) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.inspections.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress", finalized_at: null } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress inspection can be finalized.");
        return inspection(await MyGlobal.prisma.inspections.update({ where: { id: row.id }, data: { status: p.status, finalized_at: new Date() } }));
    }
    export async function inspectionWaive(p: OpsIdBody<api.IInspection.IWaive>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.inspections.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress", finalized_at: null } });
        if (row === null)
            throw ErrorUtil.conflict("Only an in-progress inspection can be waived.");
        if (p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("Inspection waiver requires a reason.");
        return inspection(await MyGlobal.prisma.inspections.update({ where: { id: row.id }, data: { status: "waived", reason: p.body.reason, finalized_at: new Date() } }));
    }
    export async function equipmentCreate(p: OpsBody<api.IEquipment.ICreate>) { const org = await AuthProvider.organizationId(p.actor); return equipment(await MyGlobal.prisma.equipment.create({ data: { id: randomUUID(), organization_id: org, tag: p.body.tag, name: p.body.name, status: "active", criticality: p.body.criticality, warehouse_id: p.body.warehouseId ?? null, created_at: new Date(), updated_at: new Date() } })); }
    export async function equipmentIndex(p: OpsInput<EquipmentIndexInput>) { const org = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const where = { organization_id: org, ...(p.input.status === undefined ? {} : { status: p.input.status }), ...(p.input.criticality === undefined ? {} : { criticality: p.input.criticality }), ...(p.input.warehouseId === undefined ? {} : { warehouse_id: p.input.warehouseId }) }; const [rows, records] = await Promise.all([MyGlobal.prisma.equipment.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { tag: "asc" } }), MyGlobal.prisma.equipment.count({ where })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(equipment) }; }
    export async function equipmentUpdate(p: OpsIdBody<api.IEquipment.IUpdate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.equipment.findFirst({ where: { id: p.id, organization_id: org } });
        if (row === null)
            throw ErrorUtil.notFound("No equipment exists in the active organization.");
        if (row.status === "retired")
            throw ErrorUtil.conflict("Retired equipment cannot be edited.");
        return equipment(await MyGlobal.prisma.equipment.update({ where: { id: row.id }, data: { name: p.body.name ?? row.name, criticality: p.body.criticality ?? row.criticality, warehouse_id: p.body.warehouseId === undefined ? row.warehouse_id : p.body.warehouseId, updated_at: new Date() } }));
    }
    export async function equipmentState(p: OpsId & { status: api.IEquipment["status"] }) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.equipment.findFirst({ where: { id: p.id, organization_id: org } });
        if (row === null)
            throw ErrorUtil.notFound("No equipment exists in the active organization.");
        if (row.status === "retired" && p.status !== "retired")
            throw ErrorUtil.conflict("Retired equipment cannot be restored.");
        return equipment(await MyGlobal.prisma.equipment.update({ where: { id: row.id }, data: { status: p.status, updated_at: new Date() } }));
    }
    export async function maintenanceCreate(p: OpsBody<api.IMaintenanceOrder.ICreate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const equipment = await MyGlobal.prisma.equipment.findFirst({ where: { id: p.body.equipmentId, organization_id: org, status: { not: "retired" } } });

        if (equipment === null)
            throw ErrorUtil.notFound("No eligible equipment exists in the active organization.");
        const plan = p.body.maintenancePlanId === undefined || p.body.maintenancePlanId === null ? null : await MyGlobal.prisma.maintenance_plans.findFirst({ where: { id: p.body.maintenancePlanId, organization_id: org, equipment_id: equipment.id, status: "active" } });
        if (p.body.maintenancePlanId !== undefined && p.body.maintenancePlanId !== null && plan === null)
            throw ErrorUtil.notFound("No active maintenance plan exists for the equipment.");
        if (p.body.costCenterId !== undefined && p.body.costCenterId !== null && await MyGlobal.prisma.cost_centers.findFirst({ where: { id: p.body.costCenterId, organization_id: org, status: "active" } }) === null)
            throw ErrorUtil.notFound("No active cost center exists in the organization.");
        return maintenance(await MyGlobal.prisma.maintenance_orders.create({ data: { id: randomUUID(), organization_id: org, equipment_id: equipment.id, maintenance_plan_id: plan?.id ?? null, maintenance_plan_version: plan?.version ?? null, status: "draft", notes: p.body.notes, scheduled_at: p.body.scheduledAt === undefined || p.body.scheduledAt === null ? null : new Date(p.body.scheduledAt), assignee_id: p.body.assigneeId ?? null, cost_center_id: p.body.costCenterId ?? null, labor_rate: p.body.laborRate ?? 0, labor_posted: false, created_at: new Date(), completed_at: null } }));
    }
    export async function maintenanceComplete(p: OpsIdBody<api.IMaintenanceOrder.IComplete>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: "started" } });
        if (row === null)
            throw ErrorUtil.conflict("Only started maintenance can be completed.");
        const completedAt = new Date();
        const result = await MyGlobal.prisma.$transaction(async (tx) => {
            const updated = await tx.maintenance_orders.update({ where: { id: row.id }, data: { status: "completed", notes: p.body.notes ?? row.notes, completed_at: completedAt } });
            await tx.equipment.update({ where: { id: row.equipment_id }, data: { status: "active", updated_at: completedAt } });
            if (row.maintenance_plan_id !== null) {
                const plan = await tx.maintenance_plans.findFirst({ where: { id: row.maintenance_plan_id, organization_id: org } });
                if (plan !== null && plan.status === "active")
                    await tx.maintenance_plans.update({ where: { id: plan.id }, data: { next_due_at: new Date(completedAt.getTime() + plan.frequency_days * 86400000), updated_at: completedAt } });
            }
            return updated;
        });
        return maintenance(result);
    }
    export async function maintenanceUpdate(p: OpsIdBody<api.IMaintenanceOrder.IUpdate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["draft", "assigned"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only draft or assigned maintenance can be edited.");
        if (p.body.costCenterId !== undefined && p.body.costCenterId !== null && await MyGlobal.prisma.cost_centers.findFirst({ where: { id: p.body.costCenterId, organization_id: org, status: "active" } }) === null)
            throw ErrorUtil.notFound("No active cost center exists in the organization.");
        const updated = await MyGlobal.prisma.maintenance_orders.update({ where: { id: row.id }, data: { notes: p.body.notes ?? undefined, scheduled_at: p.body.scheduledAt === undefined ? undefined : p.body.scheduledAt === null ? null : new Date(p.body.scheduledAt), assignee_id: p.body.assigneeId === undefined ? undefined : p.body.assigneeId, cost_center_id: p.body.costCenterId === undefined ? undefined : p.body.costCenterId, labor_rate: p.body.laborRate ?? undefined, downtime_hours: p.body.downtimeHours ?? undefined, labor_hours: p.body.laborHours ?? undefined, total_cost: p.body.totalCost ?? undefined } });
        return maintenance(updated);
    }
    export async function maintenanceAssign(p: OpsId & { body: { assigneeId: string; scheduledAt?: null | string } }) {
        const org = await AuthProvider.organizationId(p.actor);
        const employee = await MyGlobal.prisma.employees.findFirst({ where: { id: p.body.assigneeId, organization_id: org, status: "active" } });
        if (employee === null)
            throw ErrorUtil.notFound("No active maintenance assignee exists in the organization.");
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only draft maintenance can be assigned.");
        return maintenance(await MyGlobal.prisma.maintenance_orders.update({ where: { id: row.id }, data: { status: "assigned", assignee_id: employee.id, scheduled_at: p.body.scheduledAt === undefined || p.body.scheduledAt === null ? null : new Date(p.body.scheduledAt) } }));
    }
    export async function maintenanceStart(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: "assigned" } });
        if (row === null)
            throw ErrorUtil.conflict("Only assigned maintenance can be started.");
        const startedAt = new Date();
        await MyGlobal.prisma.equipment.update({ where: { id: row.equipment_id }, data: { status: "maintenance", updated_at: startedAt } });
        return maintenance(await MyGlobal.prisma.maintenance_orders.update({ where: { id: row.id }, data: { status: "started", started_at: startedAt } }));
    }
    export async function maintenancePart(p: OpsIdBody<api.IMaintenanceOrder.IPart>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: "started" } });
        if (row === null)
            throw ErrorUtil.conflict("Only started maintenance can consume parts.");
        if (p.body.quantity <= 0)
            throw ErrorUtil.unprocessable("Maintenance part quantity must be positive.");
        await validateLocation(org, p.body.warehouseId, p.body.locationId);
        const item = await MyGlobal.prisma.items.findFirst({ where: { id: p.body.itemId, organization_id: org, active: true, type: { not: "service" } }, select: { id: true, tracking_mode: true } });
        if (item === null)
            throw ErrorUtil.notFound("No active inventory part exists in the organization.");
        AllocationProvider.validateTracking(item.tracking_mode, p.body.lotId ?? null, p.body.serialCode ?? null, p.body.quantity);
        const now = new Date();
        const updated = await MyGlobal.prisma.$transaction(async (tx) => {
            const available = await AllocationProvider.availabilityTracking(org, item.id, p.body.warehouseId, p.body.locationId, p.body.lotId ?? null, p.body.serialCode ?? null, tx);
            if (available.available < p.body.quantity)
                throw ErrorUtil.conflict("Insufficient eligible stock for the maintenance part.");
            await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: org, item_id: item.id, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, type: "maintenance", quantity: -p.body.quantity, unit_cost: p.body.unitCost, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, source_type: "maintenance_order", source_id: row.id, operator_membership_id: p.actor.membership_id ?? null, created_at: now } });
            return tx.maintenance_orders.update({ where: { id: row.id }, data: { total_cost: { increment: p.body.quantity * p.body.unitCost } } });
        });
        return maintenance(updated);
    }
    export async function maintenanceLabor(p: OpsIdBody<api.IMaintenanceOrder.ILabor>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: "started" } });
        if (row === null)
            throw ErrorUtil.conflict("Only started maintenance can record labor.");
        const rate = p.body.rate ?? row.labor_rate;
        const updated = await MyGlobal.prisma.maintenance_orders.update({ where: { id: row.id }, data: { labor_hours: { increment: p.body.hours }, labor_rate: rate, total_cost: { increment: p.body.hours * rate } } });
        return maintenance(updated);
    }
    export async function maintenanceDowntime(p: OpsIdBody<api.IMaintenanceOrder.IDowntime>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: "started" } });
        if (row === null)
            throw ErrorUtil.conflict("Only started maintenance can record downtime.");
        const updated = await MyGlobal.prisma.maintenance_orders.update({ where: { id: row.id }, data: { downtime_hours: { increment: p.body.hours } } });
        await MyGlobal.prisma.equipment.update({ where: { id: row.equipment_id }, data: { status: "maintenance", updated_at: new Date() } });
        return maintenance(updated);
    }
    export async function maintenanceLaborPost(p: OpsIdBody<api.IMaintenanceOrder.ILaborPost>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: "completed", labor_posted: false } });
        if (row === null)
            throw ErrorUtil.conflict("Only completed maintenance with unposted labor can be posted.");
        const center = await MyGlobal.prisma.cost_centers.findFirst({ where: { id: p.body.costCenterId, organization_id: org, status: "active" } });
        if (center === null)
            throw ErrorUtil.notFound("No active cost center exists in the organization.");
        const now = new Date();
        const updated = await MyGlobal.prisma.$transaction(async (tx) => { const currency = (await tx.organizations.findUniqueOrThrow({ where: { id: org }, select: { base_currency: true } })).base_currency; await JournalProvider.createPosted(tx, org, "maintenance_labor", row.id, now, `Maintenance labor ${row.id}`, "5000", "2000", row.total_cost, currency); return tx.maintenance_orders.update({ where: { id: row.id }, data: { cost_center_id: center.id, labor_posted: true } }); });
        return maintenance(updated);
    }
    export async function maintenanceCancel(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.maintenance_orders.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["draft", "assigned", "started"] } } });

        if (row === null)
            throw ErrorUtil.conflict("Only eligible maintenance can be cancelled.");
        const cancelledAt = new Date();
        const updated = await MyGlobal.prisma.maintenance_orders.update({ where: { id: row.id }, data: { status: "cancelled", cancelled_at: cancelledAt } });
        if (row.status === "started")
            await MyGlobal.prisma.equipment.update({ where: { id: row.equipment_id }, data: { status: "active", updated_at: cancelledAt } });
        return maintenance(updated);
    }
    export async function serviceCreate(p: OpsBody<api.IServiceCase.ICreate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const customer = await MyGlobal.prisma.parties.findFirst({ where: { id: p.body.customerId, organization_id: org, kind: "customer", status: "active" } });
        if (customer === null)
            throw ErrorUtil.notFound("No active customer exists in the active organization.");
        const slaDueAt = p.body.slaDueAt === undefined || p.body.slaDueAt === null ? null : new Date(p.body.slaDueAt);
        if (slaDueAt !== null && !Number.isFinite(slaDueAt.getTime()))
            throw ErrorUtil.unprocessable("The service-case SLA due date must be valid.");
        return service(await MyGlobal.prisma.service_cases.create({ data: { id: randomUUID(), organization_id: org, customer_id: customer.id, item_id: p.body.itemId ?? null, serial_number: p.body.serialNumber ?? null, priority: p.body.priority ?? "normal", sla_due_at: slaDueAt, first_response_at: null, resolved_at: null, closed_at: null, assignee_id: null, status: "open", description: p.body.description, resolution: null, created_at: new Date(), updated_at: new Date() } }));
    }
    export async function serviceIndex(p: OpsInput<api.IServiceCase.IIndex>) { const org = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const ageFrom = p.input.ageFrom === undefined ? undefined : new Date(p.input.ageFrom); const ageTo = p.input.ageTo === undefined ? undefined : new Date(p.input.ageTo); const where = { organization_id: org, ...(p.input.customerId === undefined ? {} : { customer_id: p.input.customerId }), ...(p.input.itemId === undefined ? {} : { item_id: p.input.itemId }), ...(p.input.serialNumber === undefined ? {} : { serial_number: p.input.serialNumber }), ...(p.input.status === undefined ? {} : { status: p.input.status }), ...(p.input.assigneeId === undefined ? {} : { assignee_id: p.input.assigneeId }), ...(ageFrom || ageTo ? { created_at: { ...(ageFrom ? { gte: ageFrom } : {}), ...(ageTo ? { lte: ageTo } : {}) } } : {}) }; const [rows, records] = await Promise.all([MyGlobal.prisma.service_cases.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } }), MyGlobal.prisma.service_cases.count({ where })]); const filtered = p.input.slaState === undefined ? rows : rows.filter((row) => p.input.slaState === "resolved" ? ["resolved", "closed"].includes(row.status) : !["resolved", "closed", "cancelled"].includes(row.status) && row.sla_due_at !== null && (p.input.slaState === "breached" ? row.sla_due_at < new Date() : row.sla_due_at >= new Date())); return { pagination: { current: page, limit, records: p.input.slaState === undefined ? records : filtered.length, pages: Math.ceil((p.input.slaState === undefined ? records : filtered.length) / limit) }, data: filtered.map(service) }; }
    export async function serviceUpdate(p: OpsIdBody<api.IServiceCase.IUpdate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.service_cases.findFirst({ where: { id: p.id, organization_id: org } });
        if (row === null)
            throw ErrorUtil.notFound("No service case exists in the active organization.");
        if (row.status === "closed" || row.status === "cancelled")
            throw ErrorUtil.conflict("A closed or cancelled service case cannot be edited.");
        if (p.body.status === "closed" && (p.body.resolution ?? row.resolution) === null)
            throw ErrorUtil.conflict("A service case requires a resolution before closure.");
        const slaDueAt = p.body.slaDueAt === undefined || p.body.slaDueAt === null ? p.body.slaDueAt : new Date(p.body.slaDueAt);
        if (slaDueAt !== undefined && slaDueAt !== null && !Number.isFinite(slaDueAt.getTime()))
            throw ErrorUtil.unprocessable("The service-case SLA due date must be valid.");
        const status = p.body.status ?? row.status;
        const now = new Date();
        return service(await MyGlobal.prisma.service_cases.update({ where: { id: row.id }, data: { assignee_id: p.body.assigneeId === undefined ? row.assignee_id : p.body.assigneeId, priority: p.body.priority ?? row.priority, sla_due_at: slaDueAt === undefined ? undefined : slaDueAt, first_response_at: row.first_response_at ?? (["investigating", "waiting", "resolved", "closed"].includes(status) ? now : null), resolved_at: ["resolved", "closed"].includes(status) ? row.resolved_at ?? now : row.resolved_at, closed_at: status === "closed" ? row.closed_at ?? now : row.closed_at, status, resolution: p.body.resolution === undefined ? row.resolution : p.body.resolution, updated_at: now } }));
    }
    export async function serviceState(p: ServiceState) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.service_cases.findFirst({ where: { id: p.id, organization_id: org } });
        if (row === null)
            throw ErrorUtil.notFound("No service case exists in the active organization.");
        if (row.status === "closed" || row.status === "cancelled")
            throw ErrorUtil.conflict("A terminal service case cannot change state.");
        const valid = p.status === "cancelled" || (row.status === "open" && (p.status === "investigating" || p.status === "waiting")) || ((row.status === "investigating" || row.status === "waiting") && (p.status === "investigating" || p.status === "waiting" || p.status === "resolved")) || (row.status === "resolved" && p.status === "closed");
        if (!valid)
            throw ErrorUtil.conflict(`A service case cannot transition from ${row.status} to ${p.status}.`);
        if (p.status === "resolved" || p.status === "closed") {
            const resolution = p.resolution ?? row.resolution;
            if (resolution === null || resolution.trim().length === 0)
                throw ErrorUtil.conflict("A service case requires a resolution.");
        }
        const now = new Date();
        return service(await MyGlobal.prisma.service_cases.update({ where: { id: row.id }, data: { status: p.status, first_response_at: row.first_response_at ?? (["investigating", "waiting", "resolved", "closed"].includes(p.status) ? now : null), resolved_at: ["resolved", "closed"].includes(p.status) ? row.resolved_at ?? now : row.resolved_at, closed_at: p.status === "closed" ? row.closed_at ?? now : row.closed_at, resolution: p.resolution === undefined ? row.resolution : p.resolution, updated_at: now } }));
    }
    function asset(r: AssetRow): api.IAsset { return { id: r.id, tag: r.tag, name: r.name, acquisitionCost: r.acquisition_cost, sourceType: r.source_type, sourceId: r.source_id, residualValue: r.residual_value, usefulLifeMonths: r.useful_life_months, depreciationMethod: r.depreciation_method, status: r.status }; }
    export function production(r: ProductionRow): api.IProductionOrder { return { id: r.id, finishedItemId: r.finished_item_id, equipmentId: r.equipment_id, workCenterId: r.work_center_id ?? null, machineId: r.machine_id ?? null, mrpRecommendationId: r.mrp_recommendation_id ?? null, mrpRunId: r.mrp_run_id ?? null, plannedQuantity: r.planned_quantity, completedQuantity: r.completed_quantity, scrapQuantity: r.scrap_quantity, plannedMaterialCost: r.planned_material_cost ?? 0, plannedLaborCost: r.planned_labor_cost ?? 0, plannedMachineCost: r.planned_machine_cost ?? 0, plannedOverheadCost: r.planned_overhead_cost ?? 0, actualMaterialCost: r.actual_material_cost ?? 0, laborHours: r.labor_hours, laborCost: r.labor_cost, machineHours: r.machine_hours, machineCost: r.machine_cost, overheadCost: r.overhead_cost, variance: r.variance ?? 0, status: r.status, startedAt: r.started_at?.toISOString() ?? null, closedAt: r.closed_at?.toISOString() ?? null }; }
    function inspection(r: InspectionRow): api.IInspection {
        let results: Record<string, unknown> = {};
        if (r.reason !== null) {
            try {
                results = JSON.parse(r.reason);
            }
            catch { /* reason is a human note, not a result payload. */ }
        }
        return { id: r.id, itemId: r.item_id, inspectionPlanId: r.inspection_plan_id, status: r.status, reason: r.reason, results, acceptedQuantity: r.accepted_quantity ?? 0, rejectedQuantity: r.rejected_quantity ?? 0, finalizedAt: r.finalized_at?.toISOString() ?? null };
    }
    function equipment(r: EquipmentDbRow): api.IEquipment { return { id: r.id, tag: r.tag, name: r.name, status: r.status as api.IEquipment["status"], criticality: r.criticality as api.IEquipment["criticality"] }; }
    function maintenance(r: MaintenanceRow): api.IMaintenanceOrder { return { id: r.id, equipmentId: r.equipment_id, status: r.status, notes: r.notes, assigneeId: r.assignee_id ?? null, scheduledAt: r.scheduled_at?.toISOString() ?? null, startedAt: r.started_at?.toISOString() ?? null, cancelledAt: r.cancelled_at?.toISOString() ?? null, downtimeHours: r.downtime_hours ?? 0, laborHours: r.labor_hours ?? 0, laborRate: r.labor_rate ?? 0, totalCost: r.total_cost ?? 0, costCenterId: r.cost_center_id ?? null, laborPosted: r.labor_posted ?? false, completedAt: r.completed_at?.toISOString() ?? null }; }
    function service(r: ServiceRow): api.IServiceCase { return { id: r.id, customerId: r.customer_id, itemId: r.item_id, serialNumber: r.serial_number, priority: r.priority as api.IServiceCase["priority"], slaDueAt: r.sla_due_at?.toISOString() ?? null, firstResponseAt: r.first_response_at?.toISOString() ?? null, resolvedAt: r.resolved_at?.toISOString() ?? null, closedAt: r.closed_at?.toISOString() ?? null, assigneeId: r.assignee_id, status: r.status as api.IServiceCase["status"], description: r.description, resolution: r.resolution }; }
}
export namespace OperationsProvider {
    export async function assetCreateSafe(p: OpsBody<api.IAsset.ICreate>) {
        if (![p.body.acquisitionCost, p.body.residualValue].every(Number.isFinite) || p.body.acquisitionCost < 0 || p.body.residualValue < 0 || p.body.residualValue > p.body.acquisitionCost || !Number.isInteger(p.body.usefulLifeMonths) || p.body.usefulLifeMonths <= 0)
            throw ErrorUtil.unprocessable("Asset values must be finite, non-negative, and internally consistent.");
        return OperationsProvider.assetCreate(p);
    }
    export async function productionCreateSafe(p: OpsBody<api.IProductionOrder.ICreate>) {
        if (!Number.isFinite(p.body.plannedQuantity) || p.body.plannedQuantity <= 0)
            throw ErrorUtil.unprocessable("Production planned quantity must be positive and finite.");
        return OperationsProvider.productionCreate(p);
    }
    export async function productionUpdateSafe(p: OpsIdBody<api.IProductionOrder.IUpdate>) {
        if (p.body.plannedQuantity !== undefined && (!Number.isFinite(p.body.plannedQuantity) || p.body.plannedQuantity <= 0))
            throw ErrorUtil.unprocessable("Production planned quantity must be positive and finite.");
        return OperationsProvider.productionUpdate(p);
    }
    export async function productionOutputSafe(p: OpsIdBody<api.IProductionOrder.IOutput>) {
        if (!Number.isFinite(p.body.quantity) || p.body.quantity <= 0 || !Number.isFinite(p.body.unitCost) || p.body.unitCost < 0)
            throw ErrorUtil.unprocessable("Production output values must be finite and valid.");
        return OperationsProvider.productionOutput(p);
    }
    export async function productionScrapSafe(p: OpsIdBody<api.IProductionOrder.IScrap>) {
        if (!Number.isFinite(p.body.quantity) || p.body.quantity <= 0 || !Number.isFinite(p.body.unitCost) || p.body.unitCost < 0 || p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("Production scrap values must be finite and include a reason.");
        return OperationsProvider.productionScrap(p);
    }
    export async function inspectionPartialAcceptSafe(p: OpsIdBody<api.IInspection.IPartialAcceptance>) {
        if (!Number.isFinite(p.body.acceptedQuantity) || !Number.isFinite(p.body.rejectedQuantity) || p.body.acceptedQuantity <= 0 || p.body.rejectedQuantity <= 0 || p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("Partial acceptance requires finite positive quantities and a reason.");
        return OperationsProvider.inspectionPartialAccept(p);
    }
    export async function equipmentCreateSafe(p: OpsBody<api.IEquipment.ICreate>) {
        if (p.body.warehouseId !== undefined && p.body.warehouseId !== null && await MyGlobal.prisma.warehouses.findFirst({ where: { id: p.body.warehouseId, organization_id: await AuthProvider.organizationId(p.actor), active: true } }) === null)
            throw ErrorUtil.notFound("The equipment warehouse is not active in the organization.");
        return OperationsProvider.equipmentCreate(p);
    }
    export async function equipmentUpdateSafe(p: OpsIdBody<api.IEquipment.IUpdate>) {
        if (p.body.warehouseId !== undefined && p.body.warehouseId !== null && await MyGlobal.prisma.warehouses.findFirst({ where: { id: p.body.warehouseId, organization_id: await AuthProvider.organizationId(p.actor), active: true } }) === null)

            throw ErrorUtil.notFound("The equipment warehouse is not active in the organization.");
        return OperationsProvider.equipmentUpdate(p);
    }
    export async function maintenanceCreateSafe(p: OpsBody<api.IMaintenanceOrder.ICreate>) {
        if (p.body.laborRate !== undefined && (!Number.isFinite(p.body.laborRate) || p.body.laborRate < 0))
            throw ErrorUtil.unprocessable("Maintenance labor rate must be finite and non-negative.");
        return OperationsProvider.maintenanceCreate(p);
    }
    export async function maintenanceUpdateSafe(p: OpsIdBody<api.IMaintenanceOrder.IUpdate>) {
        for (const value of [p.body.laborRate, p.body.downtimeHours, p.body.laborHours, p.body.totalCost])
            if (value !== undefined && (!Number.isFinite(value) || value < 0))
                throw ErrorUtil.unprocessable("Maintenance values must be finite and non-negative.");
        return OperationsProvider.maintenanceUpdate(p);
    }
    export async function maintenancePartSafe(p: OpsIdBody<api.IMaintenanceOrder.IPart>) {
        if (!Number.isFinite(p.body.quantity) || p.body.quantity <= 0 || !Number.isFinite(p.body.unitCost) || p.body.unitCost < 0)
            throw ErrorUtil.unprocessable("Maintenance part values must be finite and valid.");
        return OperationsProvider.maintenancePart(p);
    }
    export async function maintenanceLaborSafe(p: OpsIdBody<api.IMaintenanceOrder.ILabor>) {
        if (!Number.isFinite(p.body.hours) || p.body.hours <= 0 || (p.body.rate !== undefined && (!Number.isFinite(p.body.rate) || p.body.rate < 0)))
            throw ErrorUtil.unprocessable("Maintenance labor values must be finite and valid.");
        return OperationsProvider.maintenanceLabor(p);
    }
    export async function maintenanceDowntimeSafe(p: OpsIdBody<api.IMaintenanceOrder.IDowntime>) {
        if (!Number.isFinite(p.body.hours) || p.body.hours <= 0)
            throw ErrorUtil.unprocessable("Maintenance downtime must be positive and finite.");
        return OperationsProvider.maintenanceDowntime(p);
    }
}
export namespace OperationsProvider {
    /** Transactional production consumption path used by the HTTP command. */
    export async function productionConsumeSafe(p: OpsIdBody<api.IProductionOrder.IConsume>) {
        const org = await AuthProvider.organizationId(p.actor);
        if (!Number.isFinite(p.body.quantity) || p.body.quantity <= 0 || !Number.isFinite(p.body.unitCost) || p.body.unitCost < 0)
            throw ErrorUtil.unprocessable("Production consumption values must be finite and valid.");
        await validateSafeLocation(org, p.body.warehouseId, p.body.locationId);
        const item = await MyGlobal.prisma.items.findFirst({ where: { id: p.body.itemId, organization_id: org, active: true, type: { not: "service" } } });
        if (item === null)
            throw ErrorUtil.notFound("No active component item exists in the organization.");
        AllocationProvider.validateTracking(item.tracking_mode, p.body.lotId ?? null, p.body.serialCode ?? null, p.body.quantity);
        const now = new Date();
        const row = await MyGlobal.prisma.$transaction(async (tx) => {
            const order = await tx.production_orders.findFirst({ where: { id: p.id, organization_id: org, status: "in_progress" } });
            if (order === null)
                throw ErrorUtil.conflict("Only an in-progress production order can consume components.");
            const reservations = await tx.production_reservations.findMany({ where: { organization_id: org, production_order_id: order.id, item_id: p.body.itemId, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, status: "active" }, orderBy: { created_at: "asc" } });
            const reservedQuantity = reservations.reduce((sum, reservation) => sum + reservation.quantity - reservation.consumed_quantity, 0);
            if (order.bom_id !== null && reservedQuantity < p.body.quantity)
                throw ErrorUtil.conflict("Production consumption exceeds the order's reserved component quantity.");
            const available = await AllocationProvider.availabilityTracking(org, p.body.itemId, p.body.warehouseId, p.body.locationId, p.body.lotId ?? null, p.body.serialCode ?? null, tx);
            if (available.available < p.body.quantity)
                throw ErrorUtil.conflict("Production consumption exceeds eligible available stock.");
            await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: org, item_id: p.body.itemId, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, type: "production", quantity: -p.body.quantity, unit_cost: p.body.unitCost, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, source_type: "production_order", source_id: order.id, created_at: now } });

            let remaining = p.body.quantity;
            for (const reservation of reservations) {
                if (remaining <= 0)
                    break;
                const open = reservation.quantity - reservation.consumed_quantity;
                const consumed = Math.min(open, remaining);
                await tx.production_reservations.update({ where: { id: reservation.id }, data: { consumed_quantity: { increment: consumed }, status: consumed === open ? "consumed" : "active", updated_at: now } });
                remaining -= consumed;
            }
            return order;
        });
        return { id: row.id, finishedItemId: row.finished_item_id, workCenterId: row.work_center_id ?? null, machineId: row.machine_id ?? null, equipmentId: row.equipment_id, mrpRecommendationId: row.mrp_recommendation_id ?? null, mrpRunId: row.mrp_run_id ?? null, plannedQuantity: row.planned_quantity, completedQuantity: row.completed_quantity, scrapQuantity: row.scrap_quantity, plannedMaterialCost: row.planned_material_cost ?? 0, plannedLaborCost: row.planned_labor_cost ?? 0, plannedMachineCost: row.planned_machine_cost ?? 0, plannedOverheadCost: row.planned_overhead_cost ?? 0, actualMaterialCost: row.actual_material_cost ?? 0, laborHours: row.labor_hours, laborCost: row.labor_cost, machineHours: row.machine_hours, machineCost: row.machine_cost, overheadCost: row.overhead_cost, variance: row.variance ?? 0, status: row.status, startedAt: row.started_at?.toISOString() ?? null, closedAt: row.closed_at?.toISOString() ?? null };
    }
    /** Releases a production order without subtracting its reservations twice. */
    export async function productionReleaseSafe(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.production_orders.findFirst({ where: { id: p.id, organization_id: org } });
        if (row === null)
            throw ErrorUtil.notFound("No production order exists in the active organization.");
        if (row.status !== "draft")
            throw ErrorUtil.conflict("Only a draft production order can be released.");
        if (row.equipment_id !== null) {
            const equipment = await MyGlobal.prisma.equipment.findUnique({ where: { id: row.equipment_id } });
            if (equipment?.status === "maintenance" || equipment?.status === "out_of_service")
                throw ErrorUtil.conflict("Production cannot be scheduled while its equipment is down.");
        }
        const released = await MyGlobal.prisma.$transaction(async (tx) => {
            const claimed = await tx.production_orders.updateMany({ where: { id: row.id, organization_id: org, status: "draft" }, data: { status: "released", updated_at: new Date() } });
            if (claimed.count !== 1)
                throw ErrorUtil.conflict("The production order changed while it was being released.");
            if (row.bom_id !== null) {
                if (row.warehouse_id === null || row.location_id === null)
                    throw ErrorUtil.conflict("A production order with components requires an issue warehouse and location.");
                const lines = await tx.bom_lines.findMany({ where: { bom_id: row.bom_id } });
                const organization = await tx.organizations.findUniqueOrThrow({ where: { id: org }, select: { negative_stock_allowed: true } });
                for (const line of lines) {
                    const quantity = line.quantity * row.planned_quantity;
                    const available = await AllocationProvider.availabilityOn(tx, org, line.item_id, row.warehouse_id, row.location_id);
                    if (!organization.negative_stock_allowed && available.available < quantity)
                        throw ErrorUtil.conflict("Production release exceeds eligible component availability.");
                    await tx.production_reservations.create({ data: { id: randomUUID(), organization_id: org, production_order_id: row.id, item_id: line.item_id, warehouse_id: row.warehouse_id, location_id: row.location_id, quantity, consumed_quantity: 0, status: "active", created_at: new Date(), updated_at: new Date() } });
                }
            }
            return tx.production_orders.findUniqueOrThrow({ where: { id: row.id } });
        });
        return production(released);
    }
    export async function assetTransfer(p: OpsIdBody<api.IAsset.ITransfer>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.assets.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["active", "impaired"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only an active asset can be transferred.");
        if (p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("An asset transfer requires a reason.");
        const now = new Date();
        const transfer = await MyGlobal.prisma.$transaction(async (tx) => { const created = await tx.asset_transfers.create({ data: { id: randomUUID(), organization_id: org, asset_id: row.id, prior_custodian_id: row.custodian_id, next_custodian_id: p.body.nextCustodianId ?? row.custodian_id, prior_location_id: row.location_id, next_location_id: p.body.nextLocationId ?? row.location_id, reason: p.body.reason, actor_membership_id: p.actor.membership_id!, created_at: now } }); await tx.assets.update({ where: { id: row.id }, data: { custodian_id: p.body.nextCustodianId === undefined ? row.custodian_id : p.body.nextCustodianId, location_id: p.body.nextLocationId === undefined ? row.location_id : p.body.nextLocationId, updated_at: now } }); return created; });
        return assetTransferDto(transfer);
    }
    export async function assetImpair(p: OpsIdBody<api.IAsset.IImpair>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.assets.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["active", "impaired"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only an active asset can be impaired.");
        if (p.body.amount <= 0 || p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("An impairment requires a positive amount and reason.");
        const carryingValueBefore = await assetCarryingValue(org, row);
        if (p.body.amount > carryingValueBefore)
            throw ErrorUtil.conflict("An impairment cannot exceed the asset carrying value.");
        const now = new Date();
        const impairmentId = randomUUID();
        const created = await MyGlobal.prisma.$transaction(async (tx) => { const impairment = await tx.asset_impairments.create({ data: { id: impairmentId, organization_id: org, asset_id: row.id, amount: p.body.amount, carrying_value_before: carryingValueBefore, carrying_value_after: carryingValueBefore - p.body.amount, reason: p.body.reason, actor_membership_id: p.actor.membership_id!, created_at: now } }); await JournalProvider.createPosted(tx, org, "asset_impairment", impairment.id, now, `Asset impairment ${row.tag}`, "5000", "1600", impairment.amount, (await tx.organizations.findUniqueOrThrow({ where: { id: org }, select: { base_currency: true } })).base_currency); await tx.assets.update({ where: { id: row.id }, data: { status: "impaired", updated_at: now } }); return impairment; });
        return assetImpairment(created);
    }
    export async function assetDispose(p: OpsIdBody<api.IAsset.IDispose>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.assets.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["active", "impaired"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only an active or impaired asset can be disposed.");
        if (p.body.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("An asset disposal requires a reason.");
        const carryingValue = await assetCarryingValue(org, row);
        const proceeds = p.body.proceeds ?? 0;
        const gainOrLoss = proceeds - carryingValue;
        const now = new Date();
        const disposalId = randomUUID();
        const created = await MyGlobal.prisma.$transaction(async (tx) => { const disposal = await tx.asset_disposals.create({ data: { id: disposalId, organization_id: org, asset_id: row.id, type: p.body.type, reason: p.body.reason, proceeds, carrying_value: carryingValue, gain_or_loss: gainOrLoss, actor_membership_id: p.actor.membership_id!, created_at: now } }); const currency = (await tx.organizations.findUniqueOrThrow({ where: { id: org }, select: { base_currency: true } })).base_currency; await JournalProvider.createPostedLines(tx, org, "asset_disposal", disposal.id, now, `Asset disposal ${row.tag}`, [{ accountCode: "1000", debit: proceeds, credit: 0 }, { accountCode: "5000", debit: Math.max(0, -gainOrLoss), credit: 0 }, { accountCode: "1600", debit: 0, credit: carryingValue }, { accountCode: "4000", debit: 0, credit: Math.max(0, gainOrLoss) }], currency); await tx.assets.update({ where: { id: row.id }, data: { status: "disposed", updated_at: now } }); return disposal; });
        return assetDisposal(created);
    }
    export async function assetRetire(p: OpsId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.assets.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["active", "impaired", "disposed"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only an active, impaired, or disposed asset can be retired.");
        return assetDto(await MyGlobal.prisma.assets.update({ where: { id: row.id }, data: { status: "retired", updated_at: new Date() } }));
    }
    async function assetCarryingValue(org: string, row: AssetRow) { const [depreciation, impairments] = await Promise.all([MyGlobal.prisma.depreciation_schedules.findMany({ where: { organization_id: org, asset_id: row.id, status: "posted" }, select: { planned_amount: true } }), MyGlobal.prisma.asset_impairments.findMany({ where: { organization_id: org, asset_id: row.id }, select: { amount: true } })]); return Math.max(0, row.acquisition_cost - depreciation.reduce((sum, value) => sum + value.planned_amount, 0) - impairments.reduce((sum, value) => sum + value.amount, 0)); }
    function assetTransferDto(row: Awaited<ReturnType<typeof MyGlobal.prisma.asset_transfers.findUniqueOrThrow>>) { return { id: row.id, assetId: row.asset_id, priorCustodianId: row.prior_custodian_id, nextCustodianId: row.next_custodian_id, priorLocationId: row.prior_location_id, nextLocationId: row.next_location_id, reason: row.reason, createdAt: row.created_at.toISOString() }; }
    function assetImpairment(row: Awaited<ReturnType<typeof MyGlobal.prisma.asset_impairments.findUniqueOrThrow>>) { return { id: row.id, assetId: row.asset_id, amount: row.amount, carryingValueBefore: row.carrying_value_before, carryingValueAfter: row.carrying_value_after, reason: row.reason, createdAt: row.created_at.toISOString() }; }
    function assetDisposal(row: Awaited<ReturnType<typeof MyGlobal.prisma.asset_disposals.findUniqueOrThrow>>): api.IAssetDisposal { return { id: row.id, assetId: row.asset_id, type: row.type as api.IAssetDisposal["type"], reason: row.reason, proceeds: row.proceeds, carryingValue: row.carrying_value, gainOrLoss: row.gain_or_loss, createdAt: row.created_at.toISOString() }; }
    function assetDto(row: AssetRow): api.IAsset { return { id: row.id, tag: row.tag, name: row.name, acquisitionCost: row.acquisition_cost, sourceType: row.source_type, sourceId: row.source_id, residualValue: row.residual_value, usefulLifeMonths: row.useful_life_months, depreciationMethod: row.depreciation_method, status: row.status }; }
    async function validateSafeLocation(org: string, warehouseId: string, locationId: string) {
        const warehouse = await MyGlobal.prisma.warehouses.findFirst({ where: { id: warehouseId, organization_id: org, active: true } });
        const location = await MyGlobal.prisma.locations.findFirst({ where: { id: locationId, warehouse_id: warehouseId, active: true } });
        if (warehouse === null || location === null)
            throw ErrorUtil.notFound("The warehouse and location must be active in the organization.");
    }
}
export async function serviceIndex(p: OpsInput<api.IServiceCase.IIndex>) {
    const org = await AuthProvider.organizationId(p.actor);
    const page = p.input.page ?? 1;
    const limit = p.input.limit || 100;
    const ageFrom = p.input.ageFrom === undefined ? undefined : new Date(p.input.ageFrom);
    const ageTo = p.input.ageTo === undefined ? undefined : new Date(p.input.ageTo);
    const where = { organization_id: org, ...(p.input.customerId === undefined ? {} : { customer_id: p.input.customerId }), ...(p.input.itemId === undefined ? {} : { item_id: p.input.itemId }), ...(p.input.serialNumber === undefined ? {} : { serial_number: p.input.serialNumber }), ...(p.input.status === undefined ? {} : { status: p.input.status }), ...(p.input.assigneeId === undefined ? {} : { assignee_id: p.input.assigneeId }), ...(ageFrom || ageTo ? { created_at: { ...(ageFrom ? { gte: ageFrom } : {}), ...(ageTo ? { lte: ageTo } : {}) } } : {}) };

    const allRows = await MyGlobal.prisma.service_cases.findMany({ where, orderBy: { created_at: "desc" } });
    const now = new Date();
    const filtered = p.input.slaState === undefined ? allRows : allRows.filter((row) => p.input.slaState === "resolved" ? ["resolved", "closed"].includes(row.status) : !["resolved", "closed", "cancelled"].includes(row.status) && row.sla_due_at !== null && (p.input.slaState === "breached" ? row.sla_due_at < now : row.sla_due_at >= now));
    const rows = filtered.slice((page - 1) * limit, page * limit);
    return { pagination: { current: page, limit, records: filtered.length, pages: Math.ceil(filtered.length / limit) }, data: rows.map((row) => ({ id: row.id, customerId: row.customer_id, itemId: row.item_id, serialNumber: row.serial_number, priority: row.priority, slaDueAt: row.sla_due_at?.toISOString() ?? null, firstResponseAt: row.first_response_at?.toISOString() ?? null, resolvedAt: row.resolved_at?.toISOString() ?? null, closedAt: row.closed_at?.toISOString() ?? null, assigneeId: row.assignee_id, status: row.status, description: row.description, resolution: row.resolution })) };
}
