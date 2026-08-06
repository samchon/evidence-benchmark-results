
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendorCredit } from "@benchmark/erp-api"; import { ProcurementSettlementProvider } from "../providers/ProcurementSettlementProvider";


 @Controller("vendor-credit-status") export class VendorCreditStatusController { /** Approves, applies, settles, refunds, or voids a vendor credit through a linked bank movement.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-credit-003-a-finance-user-refunds-a-vendor-credit-through-a-bank-or-cash-movement Retains the linked refund account and timestamp.
 */
  @core.TypedRoute.Post(":id")
  public async status(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IVendorCredit.IStatus): Promise<IVendorCredit> { return ProcurementSettlementProvider.creditStatus(h, id, input); } }
