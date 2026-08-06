import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IMaintenancePlan } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a maintenance-plan record.
*/ @Controller("maintenance-plan-create") export class MaintenancePlanCreateController {
/**
 * @evidence prisma:maintenance_plans Exposes the persisted maintenance_plans record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IMaintenancePlan.ICreate): Promise<IMaintenancePlan> { return QualityServiceProvider.maintenancePlanCreate(h, input); } }
