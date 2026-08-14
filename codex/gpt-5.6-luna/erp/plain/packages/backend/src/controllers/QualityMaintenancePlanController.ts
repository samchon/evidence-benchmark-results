import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { QualityMaintenancePlanProvider } from "../providers/QualityMaintenancePlanProvider";

@Controller("erp/quality-maintenance-plan")
@UseGuards(ErpAuthGuard)
export class QualityMaintenancePlanController {
  @core.TypedRoute.Post("inspection") public async inspectionCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IInspectionPlan.ICreate): Promise<api.IInspectionPlan> { return QualityMaintenancePlanProvider.inspectionCreate({ actor, body }); }
  @core.TypedRoute.Patch("inspection") public async inspectionIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { itemId?: string; inspectionType?: api.IInspectionPlan["inspectionType"]; status?: api.IInspectionPlan["status"] }): Promise<api.IPage<api.IInspectionPlan>> { return QualityMaintenancePlanProvider.inspectionIndex({ actor, input }); }
  @core.TypedRoute.Put("inspection/:id") public async inspectionUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IInspectionPlan.IUpdate): Promise<api.IInspectionPlan> { return QualityMaintenancePlanProvider.inspectionUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("inspection/:id/deactivate") public async inspectionDeactivate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IInspectionPlan> { return QualityMaintenancePlanProvider.inspectionDeactivate({ actor, id }); }
  @core.TypedRoute.Post("maintenance") public async maintenanceCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IMaintenancePlan.ICreate): Promise<api.IMaintenancePlan> { return QualityMaintenancePlanProvider.maintenanceCreate({ actor, body }); }
  @core.TypedRoute.Patch("maintenance") public async maintenanceIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { equipmentId?: string; status?: api.IMaintenancePlan["status"] }): Promise<api.IPage<api.IMaintenancePlan>> { return QualityMaintenancePlanProvider.maintenanceIndex({ actor, input }); }
  @core.TypedRoute.Put("maintenance/:id") public async maintenanceUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IMaintenancePlan.IUpdate): Promise<api.IMaintenancePlan> { return QualityMaintenancePlanProvider.maintenanceUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("maintenance/:id/deactivate") public async maintenanceDeactivate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMaintenancePlan> { return QualityMaintenancePlanProvider.maintenanceDeactivate({ actor, id }); }
  @core.TypedRoute.Post("maintenance/:id/generate") public async maintenanceGenerate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMaintenanceOrder> { return QualityMaintenancePlanProvider.maintenanceGenerate({ actor, id }); }
}
