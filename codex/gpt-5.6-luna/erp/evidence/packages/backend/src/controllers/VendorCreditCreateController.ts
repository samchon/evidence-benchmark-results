import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendorCredit } from "@benchmark/erp-api"; import { ProcurementSettlementProvider } from "../providers/ProcurementSettlementProvider";
/** Creates a draft vendor credit.
*/ @Controller("vendor-credit-create") export class VendorCreditCreateController {
/**
 * @evidence prisma:vendor_credits Exposes the persisted vendor_credits record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IVendorCredit.ICreate): Promise<IVendorCredit> { return ProcurementSettlementProvider.creditCreate(h, input); } }
