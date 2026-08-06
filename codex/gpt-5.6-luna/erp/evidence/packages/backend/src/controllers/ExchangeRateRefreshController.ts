
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IExchangeRate } from "@benchmark/erp-api"; import { ExchangeRateProvider } from "../providers/ExchangeRateProvider";



@Controller("exchange-rate-refresh") export class ExchangeRateRefreshController { /**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-003-the-organization-system-principal-refreshes-exchange-rates-from-configured-sources Publishes the system-attributed exchange-rate refresh command.
 * Refreshes configured exchange-rate source values under the organization system principal.
 */
  @core.TypedRoute.Post()
  public async refresh(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IExchangeRate.IRefresh): Promise<IExchangeRate[]> { return ExchangeRateProvider.refresh(headers, input); } }
