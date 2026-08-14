import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { MrpProvider } from "../providers/MrpProvider";

@Controller("erp/mrp")
@UseGuards(ErpAuthGuard)
export class MrpController {
  @core.TypedRoute.Post("run") public async runCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IMrpRun.ICreate): Promise<api.IMrpRun> { return MrpProvider.runCreate({ actor, body }); }
  @core.TypedRoute.Patch("run") public async runIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IMrpRun>> { return MrpProvider.runIndex({ actor, input }); }
  @core.TypedRoute.Patch("run/:runId/recommendation") public async recommendationIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("runId") runId: string & tags.Format<"uuid">, @core.TypedBody() input: api.IPage.IRequest & { status?: api.IMrpRecommendation["status"] }): Promise<api.IPage<api.IMrpRecommendation>> { return MrpProvider.recommendationIndex({ actor, runId, input }); }
  @core.TypedRoute.Put("recommendation/:id/:status") public async recommendationState(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "accepted" | "dismissed"): Promise<api.IMrpRecommendation> { return MrpProvider.recommendationState({ actor, id, status }); }
  @core.TypedRoute.Put("recommendation/:id/accept-purchase") public async recommendationPurchase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMrpRecommendation> { return MrpProvider.acceptPurchase({ actor, id }); }
  @core.TypedRoute.Put("recommendation/:id/accept-production") public async recommendationProduction(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMrpRecommendation> { return MrpProvider.acceptProduction({ actor, id }); }
  @core.TypedRoute.Put("recommendation/:id/dismiss") public async recommendationDismiss(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IMrpRecommendation.IAction): Promise<api.IMrpRecommendation> { return MrpProvider.dismiss({ actor, id, reason: body.reason }); }
}
