import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { SalesPriceProvider } from "../providers/SalesPriceProvider";

/** Effective sales-price operations. */
@Controller("erp/sales-price")
@UseGuards(ErpAuthGuard)
export class SalesPriceController {
  @core.TypedRoute.Post() public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ISalesPrice.ICreate): Promise<api.ISalesPrice> { return SalesPriceProvider.create({ actor, body }); }
  @core.TypedRoute.Patch() public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.ISalesPrice.IIndex): Promise<api.IPage<api.ISalesPrice>> { return SalesPriceProvider.index({ actor, input }); }
  @core.TypedRoute.Post("resolve") public async resolve(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.ISalesPrice.IResolve): Promise<api.ISalesPrice> { return SalesPriceProvider.resolve({ actor, input }); }
  @core.TypedRoute.Put(":id/deactivate") public async deactivate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesPrice> { return SalesPriceProvider.deactivate({ actor, id }); }
}
