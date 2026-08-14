import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";

/** Currency, exchange-rate, payment-term, and tax configuration. */
@Controller("erp/config")
@UseGuards(ErpAuthGuard)
export class ConfigurationController {
  @core.TypedRoute.Post("currency") public async currencyCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ICurrency.ICreate): Promise<api.ICurrency> { return ConfigurationProvider.currencyCreate({ actor, body }); }
  @core.TypedRoute.Patch("currency") public async currencyIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { search?: null | string }): Promise<api.IPage<api.ICurrency>> { return ConfigurationProvider.currencyIndex({ actor, input }); }
  @core.TypedRoute.Put("currency/:id") public async currencyUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ICurrency.IUpdate): Promise<api.ICurrency> { return ConfigurationProvider.currencyUpdate({ actor, id, body }); }
  @core.TypedRoute.Delete("currency/:id") public async currencyErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return ConfigurationProvider.currencyErase({ actor, id }); }
  @core.TypedRoute.Post("exchange-rate") public async rateCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IExchangeRate.ICreate): Promise<api.IExchangeRate> { return ConfigurationProvider.rateCreate({ actor, body }); }
  @core.TypedRoute.Patch("exchange-rate") public async rateIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { sourceCurrency?: null | string; targetCurrency?: null | string }): Promise<api.IPage<api.IExchangeRate>> { return ConfigurationProvider.rateIndex({ actor, input }); }
  @core.TypedRoute.Post("payment-term") public async termCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPaymentTerm.ICreate): Promise<api.IPaymentTerm> { return ConfigurationProvider.termCreate({ actor, body }); }
  @core.TypedRoute.Patch("payment-term") public async termIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IPaymentTerm>> { return ConfigurationProvider.termIndex({ actor, input }); }
  @core.TypedRoute.Put("payment-term/:id") public async termUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPaymentTerm.IUpdate): Promise<api.IPaymentTerm> { return ConfigurationProvider.termUpdate({ actor, id, body }); }
  @core.TypedRoute.Delete("payment-term/:id") public async termErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return ConfigurationProvider.termErase({ actor, id }); }
  @core.TypedRoute.Post("tax-jurisdiction") public async jurisdictionCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITaxJurisdiction.ICreate): Promise<api.ITaxJurisdiction> { return ConfigurationProvider.jurisdictionCreate({ actor, body }); }
  @core.TypedRoute.Patch("tax-jurisdiction") public async jurisdictionIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ITaxJurisdiction>> { return ConfigurationProvider.jurisdictionIndex({ actor, input }); }
  @core.TypedRoute.Put("tax-jurisdiction/:id") public async jurisdictionUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITaxJurisdiction.IUpdate): Promise<api.ITaxJurisdiction> { return ConfigurationProvider.jurisdictionUpdate({ actor, id, body }); }
  @core.TypedRoute.Delete("tax-jurisdiction/:id") public async jurisdictionErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return ConfigurationProvider.jurisdictionErase({ actor, id }); }
  @core.TypedRoute.Post("tax-code") public async taxCodeCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITaxCode.ICreate): Promise<api.ITaxCode> { return ConfigurationProvider.taxCodeCreate({ actor, body }); }
  @core.TypedRoute.Patch("tax-code") public async taxCodeIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ITaxCode>> { return ConfigurationProvider.taxCodeIndex({ actor, input }); }
  @core.TypedRoute.Put("tax-code/:id") public async taxCodeUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITaxCode.IUpdate): Promise<api.ITaxCode> { return ConfigurationProvider.taxCodeUpdate({ actor, id, body }); }
  @core.TypedRoute.Delete("tax-code/:id") public async taxCodeErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return ConfigurationProvider.taxCodeErase({ actor, id }); }
  @core.TypedRoute.Post("tax-rate") public async taxRateCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITaxRate.ICreate): Promise<api.ITaxRate> { return ConfigurationProvider.taxRateCreate({ actor, body }); }
  @core.TypedRoute.Post("tax-rate/resolve") public async taxRateResolve(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITaxRate.IResolve): Promise<api.ITaxRate> { return ConfigurationProvider.taxRateResolve({ actor, body }); }
}
