import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IInspectionPlan } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a inspection-plan record.
*/ @Controller("inspection-plan-create") export class InspectionPlanCreateController {
/**
 * @evidence prisma:inspection_plans Exposes the persisted inspection_plans record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IInspectionPlan.ICreate): Promise<IInspectionPlan> { return QualityServiceProvider.planCreate(h, input); } }
