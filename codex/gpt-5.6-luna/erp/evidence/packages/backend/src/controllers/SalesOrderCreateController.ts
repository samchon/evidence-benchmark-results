import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesOrder } from "@benchmark/erp-api"; import { SalesProvider } from "../providers/SalesProvider";
/** Creates a sales order from an accepted quote or direct sale.
*/ @Controller("sales-order-create") export class SalesOrderCreateController {
/**
 * @evidence prisma:sales_orders Exposes the persisted sales_orders record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ISalesOrder.ICreate): Promise<ISalesOrder> { return SalesProvider.orderCreate(h, input); } }
