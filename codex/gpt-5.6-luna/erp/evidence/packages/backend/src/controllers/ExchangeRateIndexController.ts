
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IExchangeRate, IPage } from "@benchmark/erp-api"; import { ExchangeRateProvider } from "../providers/ExchangeRateProvider";


 @Controller("exchange-rate-search") export class ExchangeRateIndexController {
/** @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-002-searches-exchange-rates-by-currency-pair-and-effective-date Lists effective-dated rates for a currency pair.
 * @evidence prisma:exchange_rates Exposes the persisted exchange_rates record through this operation.
*/
  @core.TypedRoute.Patch()
  public async index(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IExchangeRate.IRequest): Promise<IPage<IExchangeRate>> { return ExchangeRateProvider.index(headers, input); } }
