import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesReturn } from "@benchmark/erp-api"; import { SalesSettlementProvider } from "../providers/SalesSettlementProvider";
/** Creates a draft sales return.
*/ @Controller("sales-return-create") export class SalesReturnCreateController {
/**
 * @evidence prisma:sales_returns Exposes the persisted sales_returns record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ISalesReturn.ICreate): Promise<ISalesReturn> { return SalesSettlementProvider.returnCreate(h, input); } }
