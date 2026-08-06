import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICurrency } from "@benchmark/erp-api"; import { ReferenceDataProvider } from "../providers/ReferenceDataProvider";
/** Creates a supported currency.
*/ @Controller("currency-create") export class CurrencyCreateController {
/**
 * @evidence prisma:currencies Exposes the persisted currencies record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: ICurrency.ICreate): Promise<ICurrency> { return ReferenceDataProvider.currencyCreate({ headers, input }); } }
