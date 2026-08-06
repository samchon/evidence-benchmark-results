import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITaxJurisdiction } from "@benchmark/erp-api"; import { TaxProvider } from "../providers/TaxProvider";
/** Creates a tax jurisdiction.
*/ @Controller("tax-jurisdiction-create") export class TaxJurisdictionCreateController {
/**
 * @evidence prisma:tax_jurisdictions Exposes the persisted tax_jurisdictions record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: ITaxJurisdiction.ICreate): Promise<ITaxJurisdiction> { return TaxProvider.jurisdictionCreate(headers, input); } }
