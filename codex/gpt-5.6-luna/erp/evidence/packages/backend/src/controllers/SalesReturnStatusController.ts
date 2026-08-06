
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesReturn } from "@benchmark/erp-api"; import { SalesSettlementProvider } from "../providers/SalesSettlementProvider";


 @Controller("sales-return-status") export class SalesReturnStatusController { /** Approves, posts, refunds, rejects, or voids a sales return while retaining its linked correction.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-return-006-a-finance-user-refunds-a-received-return-through-a-credit-memo-or-customer-payment Retains exactly one refund source.
 */
  @core.TypedRoute.Post(":id")
  public async status(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: ISalesReturn.IStatus): Promise<ISalesReturn> { return SalesSettlementProvider.returnStatus(h, id, input); } }
