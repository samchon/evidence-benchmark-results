import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITaxCode } from "@benchmark/erp-api"; import { TaxProvider } from "../providers/TaxProvider";
/** Creates a tax code inside a jurisdiction.
*/ @Controller("tax-code-create") export class TaxCodeCreateController {
/**
 * @evidence prisma:tax_codes Exposes the persisted tax_codes record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: ITaxCode.ICreate): Promise<ITaxCode> { return TaxProvider.codeCreate(headers, input); } }
