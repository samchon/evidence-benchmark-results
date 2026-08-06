import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICustomerPaymentAllocation } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("customer-payment-allocation-create") export class CustomerPaymentAllocationCreateController {
/**
 * @evidence prisma:customer_payment_allocations Exposes the persisted customer_payment_allocations record through this operation.
 * @evidence prisma:customer_payments Exposes the persisted customer_payments record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ICustomerPaymentAllocation.ICreate):Promise<ICustomerPaymentAllocation>{return P.customerPaymentAllocationCreate(h,i);} }
