import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITaxRate } from "@benchmark/erp-api"; import { TaxProvider } from "../providers/TaxProvider";
/** Records an effective tax rate.
*/ @Controller("tax-rate-create") export class TaxRateCreateController {
/**
 * @evidence prisma:tax_rates Exposes the persisted tax_rates record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: ITaxRate.ICreate): Promise<ITaxRate> { return TaxProvider.rateCreate(headers, input); } }
