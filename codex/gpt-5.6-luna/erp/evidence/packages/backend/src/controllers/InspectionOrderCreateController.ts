import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IInspectionOrder } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a inspection-order record.
*/ @Controller("inspection-order-create") export class InspectionOrderCreateController {
/**
 * @evidence prisma:inspection_orders Exposes the persisted inspection_orders record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IInspectionOrder.ICreate): Promise<IInspectionOrder> { return QualityServiceProvider.orderCreate(h, input); } }
