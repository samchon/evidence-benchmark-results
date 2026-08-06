import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPurchaseOrderLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("purchase-order-line-create") export class PurchaseOrderLineCreateController {
/**
  * @evidence prisma:purchase_order_lines Exposes the persisted purchase_order_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IPurchaseOrderLine.ICreate):Promise<IPurchaseOrderLine>{return P.purchaseOrderLineCreate(h,i);} }
