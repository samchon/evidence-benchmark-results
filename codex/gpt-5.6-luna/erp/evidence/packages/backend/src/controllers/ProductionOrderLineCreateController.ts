import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IProductionOrderLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("production-order-line-create") export class ProductionOrderLineCreateController {
/**
  * @evidence prisma:production_order_lines Exposes the persisted production_order_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IProductionOrderLine.ICreate):Promise<IProductionOrderLine>{return P.productionOrderLineCreate(h,i);} }
