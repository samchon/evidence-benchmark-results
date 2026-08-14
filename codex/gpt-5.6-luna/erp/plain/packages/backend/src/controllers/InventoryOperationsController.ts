import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { InventoryOperationsProvider } from "../providers/InventoryOperationsProvider";

/** Warehouse transfer, cycle-count, and adjustment commands. */
@Controller("erp/inventory")
@UseGuards(ErpAuthGuard)
export class InventoryOperationsController {
  @core.TypedRoute.Post("transfer") public async transferCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITransfer.ICreate): Promise<api.ITransfer> { return InventoryOperationsProvider.transferCreate({ actor, body }); }
  @core.TypedRoute.Patch("transfer") public async transferIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ITransfer>> { return InventoryOperationsProvider.transferIndex({ actor, input }); }
  @core.TypedRoute.Put("transfer/:id") public async transferUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITransfer.ICreate): Promise<api.ITransfer> { return InventoryOperationsProvider.transferUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("transfer/:id/ship") public async transferShip(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITransfer> { return InventoryOperationsProvider.transferShipSafe({ actor, id }); }
  @core.TypedRoute.Put("transfer/:id/receive") public async transferReceive(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITransfer.IReceive): Promise<api.ITransfer> { return InventoryOperationsProvider.transferReceive({ actor, id, body }); }
  @core.TypedRoute.Put("transfer/:id/cancel") public async transferCancel(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITransfer> { return InventoryOperationsProvider.transferCancel({ actor, id }); }
  @core.TypedRoute.Post("cycle-count") public async cycleCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ICycleCount.ICreate): Promise<api.ICycleCount> { return InventoryOperationsProvider.cycleCreateSafe({ actor, body }); }
  @core.TypedRoute.Patch("cycle-count") public async cycleIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ICycleCount>> { return InventoryOperationsProvider.cycleIndex({ actor, input }); }
  @core.TypedRoute.Put("cycle-count/:id/perform") public async cyclePerform(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() lines: api.ICycleCount.ICreate.ILine[]): Promise<api.ICycleCount> { return InventoryOperationsProvider.cyclePerformSafe({ actor, id, lines }); }
  @core.TypedRoute.Put("cycle-count/:id/submit") public async cycleSubmit(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ICycleCount> { return InventoryOperationsProvider.cycleSubmit({ actor, id }); }
  @core.TypedRoute.Put("cycle-count/:id/approve") public async cycleApprove(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ICycleCount> { return InventoryOperationsProvider.cycleApprove({ actor, id }); }
  @core.TypedRoute.Put("cycle-count/:id/reject") public async cycleReject(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ICycleCount.IReject): Promise<api.ICycleCount> { return InventoryOperationsProvider.cycleReject({ actor, id, reason: body.reason }); }
  @core.TypedRoute.Put("cycle-count/:id/post") public async cyclePost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ICycleCount> { return InventoryOperationsProvider.cyclePostSafe({ actor, id }); }
  @core.TypedRoute.Post("adjustment") public async adjustmentCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IInventoryAdjustment.ICreate): Promise<api.IInventoryAdjustment> { return InventoryOperationsProvider.adjustmentCreateSafe({ actor, body }); }
  @core.TypedRoute.Put("adjustment/:id/transition/:status") public async adjustmentTransition(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "approved" | "rejected"): Promise<api.IInventoryAdjustment> { return InventoryOperationsProvider.adjustmentTransition({ actor, id, status }); }
  @core.TypedRoute.Post("adjustment/:id/reverse") public async adjustmentReverse(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IInventoryAdjustment.IReverse): Promise<api.IInventoryAdjustment> { return InventoryOperationsProvider.adjustmentReverseSafe({ actor, id, reason: body.reason }); }
  @core.TypedRoute.Put("adjustment/:id/post") public async adjustmentPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IInventoryAdjustment> { return InventoryOperationsProvider.adjustmentPostSafe({ actor, id }); }
}
