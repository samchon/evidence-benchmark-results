
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IExchangeRate } from "@benchmark/erp-api"; import { ExchangeRateProvider } from "../providers/ExchangeRateProvider";


 @Controller("exchange-rate-record") export class ExchangeRateRecordController {
/** @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-exchange-rate-operations Covers exchange-rate operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-001-records-or-corrects-a-dated-exchange-rate Records or corrects an effective-dated currency conversion rate. */
  @core.TypedRoute.Post()
  public async record(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IExchangeRate.ICreate): Promise<IExchangeRate> { return ExchangeRateProvider.record(headers, input); } }
