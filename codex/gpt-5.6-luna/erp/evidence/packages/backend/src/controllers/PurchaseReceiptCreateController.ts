import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPurchaseReceipt } from "@benchmark/erp-api"; import { ProcurementSettlementProvider } from "../providers/ProcurementSettlementProvider";
/** Creates a draft purchase receipt.
*/ @Controller("purchase-receipt-create") export class PurchaseReceiptCreateController {
/**
 * @evidence prisma:purchase_receipts Exposes the persisted purchase_receipts record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IPurchaseReceipt.ICreate): Promise<IPurchaseReceipt> { return ProcurementSettlementProvider.receiptCreate(h, input); } }
