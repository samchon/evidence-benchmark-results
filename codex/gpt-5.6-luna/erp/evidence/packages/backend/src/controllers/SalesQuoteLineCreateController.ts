import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesQuoteLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("sales-quote-line-create") export class SalesQuoteLineCreateController {
/**
  * @evidence prisma:sales_quote_lines Exposes the persisted sales_quote_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ISalesQuoteLine.ICreate):Promise<ISalesQuoteLine>{return P.salesQuoteLineCreate(h,i);} }
