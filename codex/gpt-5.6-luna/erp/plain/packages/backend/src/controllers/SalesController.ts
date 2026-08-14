import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { SalesProvider } from "../providers/SalesProvider";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Order-to-cash operations. */
@Controller("erp/sales")
@UseGuards(ErpAuthGuard)
export class SalesController {
  /** Creates a sales order. @tag Sales */
  @core.TypedRoute.Post("order")
  public async orderCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ISalesOrder.ICreate): Promise<api.ISalesOrder> { return SalesProvider.orderCreate({ actor, body }); }
  /** Lists sales orders. @tag Sales */
  @core.TypedRoute.Patch("order")
  public async orderIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ISalesOrder>> { return SalesProvider.orderIndex({ actor, input }); }
  /** Reads a sales order. @tag Sales */
  @core.TypedRoute.Get("order/:id")
  public async orderAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesOrder> { return SalesProvider.orderAt({ actor, id }); }
  /** Edits a draft sales order. @tag Sales */
  @core.TypedRoute.Put("order/:id")
  public async orderUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ISalesOrder.IUpdate): Promise<api.ISalesOrder> { return SalesProvider.orderUpdate({ actor, id, body }); }
  /** Deletes a draft sales order. @tag Sales */
  @core.TypedRoute.Delete("order/:id")
  public async orderErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return SalesProvider.orderErase({ actor, id }); }
  /** Submits or cancels a sales order. @tag Sales */
  @core.TypedRoute.Put("order/:id/transition/:status")
  public async orderTransition(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "submitted" | "cancelled"): Promise<api.ISalesOrder> { return SalesProvider.orderTransition({ actor, id, status }); }
  /** Approves a sales order. @tag Sales */
  @core.TypedRoute.Put("order/:id/approve")
  public async orderApprove(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesOrder> { return SalesProvider.orderApprove({ actor, id }); }
  /** Creates a draft shipment. @tag Sales */
  @core.TypedRoute.Post("shipment")
  public async shipmentCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IShipment.ICreate): Promise<api.IShipment> { if (body.lines.length === 0) throw ErrorUtil.unprocessable("A shipment requires at least one line."); return SalesProvider.shipmentCreate({ actor, body }); }
  /** Posts a shipment and creates outbound stock movements. @tag Sales */
  @core.TypedRoute.Put("shipment/:id/post")
  public async shipmentPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShipment> { return SalesProvider.shipmentPostSafe({ actor, id }); }
  @core.TypedRoute.Put("shipment/:id/pick")
  public async shipmentPick(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShipment> { return SalesProvider.shipmentPick({ actor, id }); }
  @core.TypedRoute.Put("shipment/:id/pack")
  public async shipmentPack(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShipment> { return SalesProvider.shipmentPack({ actor, id }); }
  @core.TypedRoute.Put("shipment/:id/deliver")
  public async shipmentDeliver(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShipment> { return SalesProvider.shipmentDeliver({ actor, id }); }
  @core.TypedRoute.Put("shipment/:id/cancel")
  public async shipmentCancel(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShipment> { return SalesProvider.shipmentCancel({ actor, id }); }
}
