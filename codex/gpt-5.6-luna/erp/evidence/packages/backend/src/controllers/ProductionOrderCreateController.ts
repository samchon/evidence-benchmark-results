import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IProductionOrder } from "@benchmark/erp-api"; import { ManufacturingProvider } from "../providers/ManufacturingProvider";
/** Creates a draft production order.
*/ @Controller("production-order-create") export class ProductionOrderCreateController {
/**
 * @evidence prisma:production_orders Exposes the persisted production_orders record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IProductionOrder.ICreate): Promise<IProductionOrder> { return ManufacturingProvider.productionCreate(h, input); } }
