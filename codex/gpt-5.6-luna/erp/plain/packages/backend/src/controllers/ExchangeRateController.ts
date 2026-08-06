import * as core from "@nestia/core";
import type { IExchangeRate, IPage } from "@benchmark/erp-api";
import { Controller, Headers } from "@nestjs/common";
import { AuthProvider } from "../providers/AuthProvider";
import { ReferenceProvider } from "../providers/ReferenceProvider";
@Controller("organization/exchange-rate")
export class ExchangeRateController {
  @core.TypedRoute.Post() public async record(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: IExchangeRate.ICreate): Promise<IExchangeRate> { return ReferenceProvider.recordRate({ session: await AuthProvider.authenticate(authorization), body }); }
  @core.TypedRoute.Patch() public async list(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: IExchangeRate.IRequest): Promise<IPage<IExchangeRate>> { return ReferenceProvider.listRates({ session: await AuthProvider.authenticate(authorization), input: body }); }
  @core.TypedRoute.Post("resolve") public async resolve(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: IExchangeRate.IResolve): Promise<IExchangeRate> { return ReferenceProvider.resolveRate({ session: await AuthProvider.authenticate(authorization), body }); }
}
