import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { ManufacturingResourceProvider } from "../providers/ManufacturingResourceProvider";

/** Work centers and machines used by routing and production. */
@Controller("erp/manufacturing-resource")
@UseGuards(ErpAuthGuard)
export class ManufacturingResourceController {
  @core.TypedRoute.Post("work-center") public async workCenterCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IWorkCenter.ICreate): Promise<api.IWorkCenter> { return ManufacturingResourceProvider.workCenterCreate({ actor, body }); }
  @core.TypedRoute.Patch("work-center") public async workCenterIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { warehouseId?: string; status?: "active" | "inactive" }): Promise<api.IPage<api.IWorkCenter>> { return ManufacturingResourceProvider.workCenterIndex({ actor, input }); }
  @core.TypedRoute.Put("work-center/:id") public async workCenterUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IWorkCenter.IUpdate): Promise<api.IWorkCenter> { return ManufacturingResourceProvider.workCenterUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("work-center/:id/:status") public async workCenterState(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "active" | "inactive"): Promise<api.IWorkCenter> { return ManufacturingResourceProvider.workCenterState({ actor, id, status }); }
  @core.TypedRoute.Post("machine") public async machineCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IMachine.ICreate): Promise<api.IMachine> { return ManufacturingResourceProvider.machineCreate({ actor, body }); }
  @core.TypedRoute.Patch("machine") public async machineIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { workCenterId?: string; status?: api.IMachine["status"]; maintenanceStatus?: string }): Promise<api.IPage<api.IMachine>> { return ManufacturingResourceProvider.machineIndex({ actor, input }); }
  @core.TypedRoute.Put("machine/:id") public async machineUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IMachine.IUpdate): Promise<api.IMachine> { return ManufacturingResourceProvider.machineUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("machine/:id/equipment/:equipmentId") public async machineLink(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("equipmentId") equipmentId: string & tags.Format<"uuid">): Promise<api.IMachine> { return ManufacturingResourceProvider.machineLink({ actor, id, equipmentId }); }
  @core.TypedRoute.Put("machine/:id/retire") public async machineRetire(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMachine> { return ManufacturingResourceProvider.machineRetire({ actor, id }); }
}
