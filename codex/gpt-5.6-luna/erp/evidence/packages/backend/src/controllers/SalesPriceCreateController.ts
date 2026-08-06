import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesPrice } from "@benchmark/erp-api"; import { SalesFulfillmentProvider } from "../providers/SalesFulfillmentProvider"; @Controller("sales-price-create") export class SalesPriceCreateController {
/**
  * @evidence prisma:sales_prices Exposes the persisted sales_prices record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ISalesPrice.ICreate):Promise<ISalesPrice>{return SalesFulfillmentProvider.priceCreate(h,i);} }
