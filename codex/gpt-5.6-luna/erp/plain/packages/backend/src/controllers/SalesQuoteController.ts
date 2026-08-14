import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { SalesQuoteProvider } from "../providers/SalesQuoteProvider";

@Controller("erp/sales-quote")
@UseGuards(ErpAuthGuard)
export class SalesQuoteController {
  @core.TypedRoute.Post() public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ISalesQuote.ICreate): Promise<api.ISalesQuote> { return SalesQuoteProvider.create({ actor, body }); }
  @core.TypedRoute.Patch() public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { status?: api.ISalesQuote["status"]; customerId?: string }): Promise<api.IPage<api.ISalesQuote>> { return SalesQuoteProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id") public async update(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ISalesQuote.IUpdate): Promise<api.ISalesQuote> { return SalesQuoteProvider.update({ actor, id, body }); }
  @core.TypedRoute.Put(":id/:status") public async state(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "sent" | "accepted" | "rejected" | "expired"): Promise<api.ISalesQuote> { return SalesQuoteProvider.state({ actor, id, status }); }
  @core.TypedRoute.Post(":id/convert") public async convert(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesOrder> { return SalesQuoteProvider.convert({ actor, id }); }
}
