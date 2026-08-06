import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesOrderLine } from "@benchmark/erp-api"; import { SalesFulfillmentProvider } from "../providers/SalesFulfillmentProvider"; @Controller("sales-order-line-create") export class SalesOrderLineCreateController {
/**
  * @evidence prisma:sales_order_lines Exposes the persisted sales_order_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ISalesOrderLine.ICreate):Promise<ISalesOrderLine>{return SalesFulfillmentProvider.lineCreate(h,i);} }
