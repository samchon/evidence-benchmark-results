import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { SalesFinanceProvider } from "../providers/SalesFinanceProvider";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Sales quote, invoice, and customer-payment operations. */
@Controller("erp/sales-finance")
@UseGuards(ErpAuthGuard)
export class SalesFinanceController {
  @core.TypedRoute.Post("quote") public async quoteCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ISalesQuote.ICreate): Promise<api.ISalesQuote> { return SalesFinanceProvider.quoteCreate({ actor, body }); }
  @core.TypedRoute.Patch("quote") public async quoteIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ISalesQuote>> { return SalesFinanceProvider.quoteIndex({ actor, input }); }
  @core.TypedRoute.Put("quote/:id/:status") public async quoteTransition(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "sent" | "accepted" | "rejected" | "expired"): Promise<api.ISalesQuote> { return SalesFinanceProvider.quoteTransition({ actor, id, status }); }
  @core.TypedRoute.Post("quote/:id/convert") public async quoteConvert(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesOrder> { return SalesFinanceProvider.quoteConvert({ actor, id }); }
  @core.TypedRoute.Post("invoice") public async invoiceCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ISalesInvoice.ICreate): Promise<api.ISalesInvoice> { if (body.lines.some((line) => !Number.isFinite(line.quantity) || line.quantity <= 0)) throw ErrorUtil.unprocessable("Invoice quantities must be positive and finite."); return SalesFinanceProvider.invoiceCreate({ actor, body }); }
  @core.TypedRoute.Put("invoice/:id") public async invoiceUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ISalesInvoice.IUpdate): Promise<api.ISalesInvoice> { if (body.lines?.some((line) => !Number.isFinite(line.quantity) || line.quantity <= 0)) throw ErrorUtil.unprocessable("Invoice quantities must be positive and finite."); return SalesFinanceProvider.invoiceUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("invoice/:id/submit") public async invoiceSubmit(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesInvoice> { return SalesFinanceProvider.invoiceSubmit({ actor, id }); }
  @core.TypedRoute.Put("invoice/:id/approve") public async invoiceApprove(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesInvoice> { return SalesFinanceProvider.invoiceApprove({ actor, id }); }
  @core.TypedRoute.Put("invoice/:id/post") public async invoicePost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesInvoice> { return SalesFinanceProvider.invoicePost({ actor, id }); }
  @core.TypedRoute.Put("invoice/:id/send") public async invoiceSend(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesInvoice> { return SalesFinanceProvider.invoiceSend({ actor, id }); }
  @core.TypedRoute.Put("invoice/:id/void") public async invoiceVoid(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ISalesInvoice.IReason): Promise<api.ISalesInvoice> { return SalesFinanceProvider.invoiceVoid({ actor, id, reason: body.reason }); }
  @core.TypedRoute.Post("payment") public async paymentCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPayment.ICreate): Promise<api.IPayment> { return SalesFinanceProvider.paymentCreate({ actor, body }); }
  @core.TypedRoute.Patch("payment") public async paymentIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IPayment>> { return SalesFinanceProvider.paymentIndex({ actor, input }); }
  @core.TypedRoute.Put("payment/:id/post") public async paymentPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPayment> { return SalesFinanceProvider.paymentPost({ actor, id }); }
  @core.TypedRoute.Post("payment/:id/allocation") public async paymentAllocationCreate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") paymentId: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPaymentAllocation.ICreate): Promise<api.IPaymentAllocation> { return SalesFinanceProvider.paymentAllocationCreate({ actor, paymentId, body }); }
  @core.TypedRoute.Patch("payment/:id/allocation") public async paymentAllocationIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") paymentId: string & tags.Format<"uuid">): Promise<api.IPaymentAllocation[]> { return SalesFinanceProvider.paymentAllocationIndex({ actor, paymentId }); }
  @core.TypedRoute.Put("payment/:id/allocation/:allocationId") public async paymentAllocationUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") paymentId: string & tags.Format<"uuid">, @core.TypedParam("allocationId") allocationId: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPaymentAllocation.IUpdate): Promise<api.IPaymentAllocation> { return SalesFinanceProvider.paymentAllocationUpdate({ actor, paymentId, allocationId, body }); }
  @core.TypedRoute.Delete("payment/:id/allocation/:allocationId") public async paymentAllocationErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") paymentId: string & tags.Format<"uuid">, @core.TypedParam("allocationId") allocationId: string & tags.Format<"uuid">): Promise<api.IEntity> { return SalesFinanceProvider.paymentAllocationErase({ actor, paymentId, allocationId }); }
}
