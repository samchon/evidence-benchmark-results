import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { VendorCreditProvider } from "../providers/VendorCreditProvider";

@Controller("erp/vendor-credit")
@UseGuards(ErpAuthGuard)
export class VendorCreditController {
  @core.TypedRoute.Post("create") public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IVendorCredit.ICreate): Promise<api.IVendorCredit> { return VendorCreditProvider.create({ actor, body }); }
  @core.TypedRoute.Patch("index") public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IVendorCredit>> { return VendorCreditProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id/apply") public async apply(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IVendorCredit.IApply): Promise<api.IVendorCredit> { return VendorCreditProvider.applySafe({ actor, id, body }); }
  @core.TypedRoute.Put(":id/refund") public async refund(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IVendorCredit.IRefund): Promise<api.IVendorCredit> { return VendorCreditProvider.refundSafe({ actor, id, body }); }
}
