import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendorCreditAllocation } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("vendor-credit-allocation-create") export class VendorCreditAllocationCreateController {
/**
 * @evidence prisma:vendor_credit_allocations Exposes the persisted vendor_credit_allocations record through this operation.
 * @evidence prisma:vendor_credits Exposes the persisted vendor_credits record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IVendorCreditAllocation.ICreate):Promise<IVendorCreditAllocation>{return P.vendorCreditAllocationCreate(h,i);} }
