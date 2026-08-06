
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICreditMemo } from "@benchmark/erp-api"; import { SalesSettlementProvider } from "../providers/SalesSettlementProvider";


 @Controller("credit-memo-status") export class CreditMemoStatusController { /** Approves, applies, settles, refunds, or voids a credit memo through a linked bank movement.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-credit-memo-003-a-finance-user-refunds-remaining-credit-through-a-bank-or-cash-movement Retains the linked refund account and timestamp.
 */
  @core.TypedRoute.Post(":id")
  public async status(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: ICreditMemo.IStatus): Promise<ICreditMemo> { return SalesSettlementProvider.creditStatus(h, id, input); } }
