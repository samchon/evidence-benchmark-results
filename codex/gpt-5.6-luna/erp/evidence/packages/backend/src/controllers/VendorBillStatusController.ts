
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendorBill } from "@benchmark/erp-api"; import { ProcurementSettlementProvider } from "../providers/ProcurementSettlementProvider";


 @Controller("vendor-bill-status") export class VendorBillStatusController { /** Approves, posts, disputes, resolves, or voids a vendor bill while retaining correction history.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-009-a-finance-user-voids-an-eligible-bill-through-a-preserving-correction Voids an eligible bill through a preserving correction.
 */
  @core.TypedRoute.Post(":id")
  public async status(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IVendorBill.IStatus): Promise<IVendorBill> { return ProcurementSettlementProvider.billStatus(h, id, input); } }
