
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IExchangeRate } from "@benchmark/erp-api"; import { ExchangeRateProvider } from "../providers/ExchangeRateProvider";


 @Controller("exchange-rate-resolve") export class ExchangeRateResolveController {
  /** @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-004-selects-the-applicable-rate-for-a-foreign-currency-document-and-records-it-on-the-posting Resolves the latest rate effective on a business date. */
  @core.TypedRoute.Post()
  public async resolve(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IExchangeRate.IResolve): Promise<IExchangeRate> { return ExchangeRateProvider.resolve(headers, input); } }
