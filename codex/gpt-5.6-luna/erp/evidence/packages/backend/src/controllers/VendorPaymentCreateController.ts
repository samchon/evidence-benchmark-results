import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendorPayment } from "@benchmark/erp-api"; import { ProcurementSettlementProvider } from "../providers/ProcurementSettlementProvider";
/** Creates a draft vendor payment.
*/ @Controller("vendor-payment-create") export class VendorPaymentCreateController {
/**
 * @evidence prisma:vendor_payments Exposes the persisted vendor_payments record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IVendorPayment.ICreate): Promise<IVendorPayment> { return ProcurementSettlementProvider.paymentCreate(h, input); } }
