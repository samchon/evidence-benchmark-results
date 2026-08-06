import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendorBill } from "@benchmark/erp-api"; import { ProcurementSettlementProvider } from "../providers/ProcurementSettlementProvider";
/** Creates a draft vendor bill.
*/ @Controller("vendor-bill-create") export class VendorBillCreateController {
/**
 * @evidence prisma:vendor_bills Exposes the persisted vendor_bills record through this operation.
 * @evidence prisma:vendors Exposes the persisted vendors record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IVendorBill.ICreate): Promise<IVendorBill> { return ProcurementSettlementProvider.billCreate(h, input); } }
