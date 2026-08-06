import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendorBillLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("vendor-bill-line-create") export class VendorBillLineCreateController {
/**
  * @evidence prisma:vendor_bill_lines Exposes the persisted vendor_bill_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IVendorBillLine.ICreate):Promise<IVendorBillLine>{return P.vendorBillLineCreate(h,i);} }
