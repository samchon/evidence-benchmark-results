import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPurchaseOrderChangeRequest } from "@benchmark/erp-api"; import { PurchaseOrderChangeProvider as P } from "../providers/PurchaseOrderChangeProvider";
/** Applies an approved purchase-order change and records before/after audit values.
*/ @Controller("purchase-order-change-request-apply") export class PurchaseOrderChangeRequestApplyController {
/**
 * @evidence prisma:purchase_order_change_requests Exposes the persisted purchase_order_change_requests record through this operation.
 * @evidence prisma:purchase_orders Exposes the persisted purchase_orders record through this operation.
 */
  @core.TypedRoute.Post(":id")
  public async apply(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedParam("id") id:string):Promise<IPurchaseOrderChangeRequest>{return P.apply(h,id);} }
