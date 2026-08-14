import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { AllocationRuleProvider } from "../providers/AllocationRuleProvider";

@Controller("erp/allocation-rule")
@UseGuards(ErpAuthGuard)
export class AllocationRuleController {
  @core.TypedRoute.Post("create") public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IAllocationRule.ICreate): Promise<api.IAllocationRule> { return AllocationRuleProvider.create({ actor, body }); }
  @core.TypedRoute.Put(":id") public async update(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IAllocationRule.IUpdate): Promise<api.IAllocationRule> { return AllocationRuleProvider.update({ actor, id, body }); }
  @core.TypedRoute.Patch("index") public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { status?: api.IAllocationRule["status"]; basis?: api.IAllocationRule["basis"] }): Promise<api.IPage<api.IAllocationRule>> { return AllocationRuleProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id/activate") public async activate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAllocationRule> { return AllocationRuleProvider.activate({ actor, id }); }
  @core.TypedRoute.Put(":id/deactivate") public async deactivate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAllocationRule> { return AllocationRuleProvider.deactivate({ actor, id }); }
  @core.TypedRoute.Post(":id/execute") public async execute(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IAllocationRule.IExecute): Promise<api.IAllocationExecution> { return AllocationRuleProvider.execute({ actor, id, body }); }
  @core.TypedRoute.Put("execution/:id/post") public async post(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAllocationExecution> { return AllocationRuleProvider.post({ actor, id }); }
}
