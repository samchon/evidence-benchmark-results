import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IStockAllocation } from "@benchmark/erp-api"; import { SalesFulfillmentProvider } from "../providers/SalesFulfillmentProvider"; @Controller("stock-allocation-create") export class StockAllocationCreateController {
/**
  * @evidence prisma:stock_allocations Exposes the persisted stock_allocations record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IStockAllocation.ICreate):Promise<IStockAllocation>{return SalesFulfillmentProvider.allocationCreate(h,i);} }
