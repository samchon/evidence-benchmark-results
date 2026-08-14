import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { PurchaseProvider } from "../providers/PurchaseProvider";

/** Procure-to-pay request, order, and receipt operations. */
@Controller("erp/purchase")
@UseGuards(ErpAuthGuard)
export class PurchaseController {
  /** Creates a purchase request. @tag Purchase */
  @core.TypedRoute.Post("request")
  public async requestCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPurchaseRequest.ICreate): Promise<api.IPurchaseRequest> { return PurchaseProvider.requestCreate({ actor, body }); }
  /** Lists purchase requests. @tag Purchase */
  @core.TypedRoute.Patch("request")
  public async requestIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IPurchaseRequest>> { return PurchaseProvider.requestIndex({ actor, input }); }
  /** Reads a purchase request. @tag Purchase */
  @core.TypedRoute.Get("request/:id")
  public async requestAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPurchaseRequest> { return PurchaseProvider.requestAt({ actor, id }); }
  /** Edits a draft purchase request. @tag Purchase */
  @core.TypedRoute.Put("request/:id")
  public async requestUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPurchaseRequest.IUpdate): Promise<api.IPurchaseRequest> { return PurchaseProvider.requestUpdate({ actor, id, body }); }
  /** Deletes a draft purchase request. @tag Purchase */
  @core.TypedRoute.Delete("request/:id")
  public async requestErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return PurchaseProvider.requestErase({ actor, id }); }
  /** Changes a purchase-request lifecycle state. @tag Purchase */
  @core.TypedRoute.Put("request/:id/:status")
  public async requestTransition(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "submitted" | "approved" | "rejected" | "cancelled" | "draft"): Promise<api.IPurchaseRequest> { return PurchaseProvider.requestTransition({ actor, id, status }); }

  /** Creates a purchase order. @tag Purchase */
  @core.TypedRoute.Post("order")
  public async orderCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPurchaseOrder.ICreate): Promise<api.IPurchaseOrder> { return PurchaseProvider.orderCreate({ actor, body }); }
  /** Lists purchase orders. @tag Purchase */
  @core.TypedRoute.Patch("order")
  public async orderIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IPurchaseOrder>> { return PurchaseProvider.orderIndex({ actor, input }); }
  /** Reads a purchase order. @tag Purchase */
  @core.TypedRoute.Get("order/:id")
  public async orderAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPurchaseOrder> { return PurchaseProvider.orderAt({ actor, id }); }
  /** Edits a draft purchase order. @tag Purchase */
  @core.TypedRoute.Put("order/:id")
  public async orderUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPurchaseOrder.IUpdate): Promise<api.IPurchaseOrder> { return PurchaseProvider.orderUpdate({ actor, id, body }); }
  /** Deletes a draft purchase order. @tag Purchase */
  @core.TypedRoute.Delete("order/:id")
  public async orderErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return PurchaseProvider.orderErase({ actor, id }); }
  /** Changes a purchase-order lifecycle state. @tag Purchase */
  @core.TypedRoute.Put("order/:id/:status")
  public async orderTransition(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "submitted" | "approved" | "sent" | "closed" | "cancelled"): Promise<api.IPurchaseOrder> { return PurchaseProvider.orderTransition({ actor, id, status }); }
  /** Requests an approved controlled purchase-order change. @tag Purchase */
  @core.TypedRoute.Post("order/:id/change-request")
  public async orderChangeRequest(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPurchaseOrderChange.IRequest): Promise<api.IApproval> { return PurchaseProvider.orderChangeRequest({ actor, id, body }); }
  /** Applies an approved purchase-order change and records before/after values. @tag Purchase */
  @core.TypedRoute.Put("order-change/:id/apply")
  public async orderChangeApply(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPurchaseOrder> { return PurchaseProvider.orderChangeApply({ actor, id }); }

  /** Creates a draft goods receipt. @tag Purchase */
  @core.TypedRoute.Post("receipt")
  public async receiptCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPurchaseReceipt.ICreate): Promise<api.IPurchaseReceipt> { return PurchaseProvider.receiptCreate({ actor, body }); }
  /** Reads a receipt with immutable source quantities. @tag Purchase */
  @core.TypedRoute.Get("receipt/:id")
  public async receiptAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPurchaseReceipt> { return PurchaseProvider.receiptAt({ actor, id }); }
  /** Posts a goods receipt and creates inbound stock movements. @tag Purchase */
  @core.TypedRoute.Put("receipt/:id/post")
  public async receiptPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPurchaseReceipt> { return PurchaseProvider.receiptPostAtomic({ actor, id }); }
}
