import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICreditMemo } from "@benchmark/erp-api"; import { SalesSettlementProvider } from "../providers/SalesSettlementProvider";
/** Creates a draft credit memo.
*/ @Controller("credit-memo-create") export class CreditMemoCreateController {
/**
 * @evidence prisma:credit_memos Exposes the persisted credit_memos record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ICreditMemo.ICreate): Promise<ICreditMemo> { return SalesSettlementProvider.creditCreate(h, input); } }
