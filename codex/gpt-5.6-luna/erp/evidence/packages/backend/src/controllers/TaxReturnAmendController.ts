import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITaxReturn } from "@benchmark/erp-api"; import { TaxReturnProvider } from "../providers/TaxReturnProvider";
/** Creates a new amendment version from a filed return.
*/ @Controller("tax-return-amend") export class TaxReturnAmendController {
/**
 * @evidence prisma:tax_returns Exposes the persisted tax_returns record through this operation.
 */
  @core.TypedRoute.Post(":id")
  public async amend(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: ITaxReturn.IVersion): Promise<ITaxReturn> { return TaxReturnProvider.amend(headers, id, input); } }
