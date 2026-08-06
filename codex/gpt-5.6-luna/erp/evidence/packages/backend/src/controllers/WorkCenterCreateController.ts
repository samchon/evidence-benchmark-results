import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IWorkCenter } from "@benchmark/erp-api"; import { ManufacturingProvider } from "../providers/ManufacturingProvider";
/** Creates a work center.
*/ @Controller("work-center-create") export class WorkCenterCreateController {
/**
 * @evidence prisma:work_centers Exposes the persisted work_centers record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IWorkCenter.ICreate): Promise<IWorkCenter> { return ManufacturingProvider.workCenterCreate(h, input); } }
