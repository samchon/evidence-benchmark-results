import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesQuote } from "@benchmark/erp-api"; import { SalesProvider } from "../providers/SalesProvider";
/** Creates a draft sales quote.
*/ @Controller("sales-quote-create") export class SalesQuoteCreateController {
/**
 * @evidence prisma:sales_quotes Exposes the persisted sales_quotes record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ISalesQuote.ICreate): Promise<ISalesQuote> { return SalesProvider.quoteCreate(h, input); } }
