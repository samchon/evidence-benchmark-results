import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { DepreciationProvider } from "../providers/DepreciationProvider";

/** Fixed-asset depreciation schedules and posting runs. */
@Controller("erp/depreciation")
@UseGuards(ErpAuthGuard)
export class DepreciationController {
  @core.TypedRoute.Post("asset/:id/schedule") public async scheduleCreate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") assetId: string & tags.Format<"uuid">, @core.TypedBody() body: api.IDepreciationSchedule.ICreate): Promise<api.IDepreciationSchedule> { return DepreciationProvider.scheduleCreate({ actor, assetId, body }); }
  @core.TypedRoute.Get("asset/:id/schedule") public async scheduleIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") assetId: string & tags.Format<"uuid">): Promise<api.IDepreciationSchedule[]> { return DepreciationProvider.scheduleIndex({ actor, assetId }); }
  @core.TypedRoute.Post("run") public async runCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IDepreciationRun.ICreate): Promise<api.IDepreciationRun> { return DepreciationProvider.runCreate({ actor, body }); }
  @core.TypedRoute.Put("run/:id/post") public async runPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IDepreciationRun> { return DepreciationProvider.runPost({ actor, id }); }
}
