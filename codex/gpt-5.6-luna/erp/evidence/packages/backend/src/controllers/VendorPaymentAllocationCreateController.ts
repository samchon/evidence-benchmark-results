import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendorPaymentAllocation } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("vendor-payment-allocation-create") export class VendorPaymentAllocationCreateController {
/**
 * @evidence prisma:vendor_payment_allocations Exposes the persisted vendor_payment_allocations record through this operation.
 * @evidence prisma:vendor_payments Exposes the persisted vendor_payments record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IVendorPaymentAllocation.ICreate):Promise<IVendorPaymentAllocation>{return P.vendorPaymentAllocationCreate(h,i);} }
