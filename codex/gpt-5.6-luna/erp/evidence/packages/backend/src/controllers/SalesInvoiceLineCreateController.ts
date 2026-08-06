import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesInvoiceLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("sales-invoice-line-create") export class SalesInvoiceLineCreateController {
/**
  * @evidence prisma:sales_invoice_lines Exposes the persisted sales_invoice_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ISalesInvoiceLine.ICreate):Promise<ISalesInvoiceLine>{return P.salesInvoiceLineCreate(h,i);} }
