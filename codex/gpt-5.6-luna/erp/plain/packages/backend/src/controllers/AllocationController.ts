import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { AllocationProvider } from "../providers/AllocationProvider";

/** Sales-order stock allocation and availability. */
@Controller("erp/allocation")
@UseGuards(ErpAuthGuard)
export class AllocationController {
  @core.TypedRoute.Post() public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IAllocation.ICreate): Promise<api.IAllocation> { return AllocationProvider.create({ actor, body }); }
  @core.TypedRoute.Patch() public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IAllocation.IIndex): Promise<api.IPage<api.IAllocation>> { return AllocationProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id/release") public async release(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAllocation> { return AllocationProvider.release({ actor, id }); }
  @core.TypedRoute.Post("availability") public async availabilityAt(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IAvailability.IRequest): Promise<api.IAvailability> { return AllocationProvider.availabilityAt({ actor, body }); }
}
