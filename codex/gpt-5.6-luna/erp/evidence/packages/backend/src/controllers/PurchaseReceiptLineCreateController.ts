import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPurchaseReceiptLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("purchase-receipt-line-create") export class PurchaseReceiptLineCreateController {
/**
  * @evidence prisma:purchase_receipt_lines Exposes the persisted purchase_receipt_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IPurchaseReceiptLine.ICreate):Promise<IPurchaseReceiptLine>{return P.purchaseReceiptLineCreate(h,i);} }
