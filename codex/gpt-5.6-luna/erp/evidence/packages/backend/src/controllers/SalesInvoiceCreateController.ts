import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesInvoice } from "@benchmark/erp-api"; import { SalesSettlementProvider } from "../providers/SalesSettlementProvider";
/** Creates a draft sales invoice.
*/ @Controller("sales-invoice-create") export class SalesInvoiceCreateController {
/**
 * @evidence prisma:sales_invoices Exposes the persisted sales_invoices record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ISalesInvoice.ICreate): Promise<ISalesInvoice> { return SalesSettlementProvider.invoiceCreate(h, input); } }
