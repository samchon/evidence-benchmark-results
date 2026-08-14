import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { FinancialCenterProvider } from "../providers/FinancialCenterProvider";

/** Cost and profit center dimensions. */
@Controller("erp/financial-center")
@UseGuards(ErpAuthGuard)
export class FinancialCenterController {
  @core.TypedRoute.Post("cost") public async costCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ICostCenter.ICreate): Promise<api.ICostCenter> { return FinancialCenterProvider.costCreate({ actor, body }); }
  @core.TypedRoute.Patch("cost") public async costIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { status?: "active" | "inactive" }): Promise<api.IPage<api.ICostCenter>> { return FinancialCenterProvider.costIndex({ actor, input }); }
  @core.TypedRoute.Put("cost/:id") public async costUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ICostCenter.IUpdate): Promise<api.ICostCenter> { return FinancialCenterProvider.costUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("cost/:id/:status") public async costState(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "active" | "inactive"): Promise<api.ICostCenter> { return FinancialCenterProvider.costState({ actor, id, status }); }
  @core.TypedRoute.Post("profit") public async profitCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IProfitCenter.ICreate): Promise<api.IProfitCenter> { return FinancialCenterProvider.profitCreate({ actor, body }); }
  @core.TypedRoute.Patch("profit") public async profitIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { status?: "active" | "inactive" }): Promise<api.IPage<api.IProfitCenter>> { return FinancialCenterProvider.profitIndex({ actor, input }); }
  @core.TypedRoute.Put("profit/:id") public async profitUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IProfitCenter.IUpdate): Promise<api.IProfitCenter> { return FinancialCenterProvider.profitUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("profit/:id/:status") public async profitState(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "active" | "inactive"): Promise<api.IProfitCenter> { return FinancialCenterProvider.profitState({ actor, id, status }); }
}
