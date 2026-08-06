import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICustomerPayment } from "@benchmark/erp-api"; import { SalesSettlementProvider } from "../providers/SalesSettlementProvider";
/** Creates a draft customer payment.
*/ @Controller("customer-payment-create") export class CustomerPaymentCreateController {
/**
 * @evidence prisma:customer_payments Exposes the persisted customer_payments record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ICustomerPayment.ICreate): Promise<ICustomerPayment> { return SalesSettlementProvider.paymentCreate(h, input); } }
