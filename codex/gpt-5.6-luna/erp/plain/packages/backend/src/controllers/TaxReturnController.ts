import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { TaxReturnProvider } from "../providers/TaxReturnProvider";

/** Tax-return preparation, reconciliation, filing, and amendment. */
@Controller("erp/tax-return")
@UseGuards(ErpAuthGuard)
export class TaxReturnController {
  @core.TypedRoute.Post() public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITaxReturn.ICreate): Promise<api.ITaxReturn> { return TaxReturnProvider.create({ actor, body }); }
  @core.TypedRoute.Patch() public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.ITaxReturn.IIndex): Promise<api.IPage<api.ITaxReturn>> { return TaxReturnProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id/reconcile") public async reconcile(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITaxReturn> { return TaxReturnProvider.reconcile({ actor, id }); }
  @core.TypedRoute.Put(":id/approve") public async approve(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITaxReturn> { return TaxReturnProvider.approve({ actor, id }); }
  @core.TypedRoute.Put(":id/reject") public async reject(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITaxReturn.IReject): Promise<api.ITaxReturn> { return TaxReturnProvider.reject({ actor, id, reason: body.reason }); }
  @core.TypedRoute.Put(":id/file") public async file(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITaxReturn> { return TaxReturnProvider.file({ actor, id }); }
  @core.TypedRoute.Post(":id/amend") public async amend(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITaxReturn.IAmend): Promise<api.ITaxReturn> { return TaxReturnProvider.amend({ actor, id, body }); }
}
