import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { AutomationProvider } from "../providers/AutomationProvider";

@Controller("erp/control-ops/automation")
@UseGuards(ErpAuthGuard)
export class AutomationController {
  @core.TypedRoute.Patch("index") public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IAutomationRun>> { return AutomationProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id/retry") public async retry(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAutomationRun> { return AutomationProvider.retry({ actor, id }); }
}
