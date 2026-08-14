import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { QuarantineProvider } from "../providers/QuarantineProvider";

@Controller("erp/quarantine")
@UseGuards(ErpAuthGuard)
export class QuarantineController {
  @core.TypedRoute.Post("create") public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IQuarantine.ICreate): Promise<api.IQuarantine> { return QuarantineProvider.create({ actor, body }); }
  @core.TypedRoute.Patch("index") public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { itemId?: string; status?: api.IQuarantine["status"] }): Promise<api.IPage<api.IQuarantine>> { return QuarantineProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id/approve") public async approve(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IQuarantine> { return QuarantineProvider.approve({ actor, id }); }
  @core.TypedRoute.Put(":id/:action") public async disposition(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("action") action: "release" | "reject" | "rework" | "return" | "scrap" | "use_as_is", @core.TypedBody() body: api.IQuarantine.IAction): Promise<api.IQuarantine> { return QuarantineProvider.action({ actor, id, action, reason: body.reason }); }
}
