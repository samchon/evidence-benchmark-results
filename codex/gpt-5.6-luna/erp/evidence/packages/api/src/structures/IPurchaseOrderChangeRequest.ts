import type { tags } from "typia";
import type { IPage } from "../typings";

/** Controlled commercial change to a purchase order.
 */
/**
 * @evidence prisma:purchase_order_change_requests Exposes the persisted purchase_order_change_requests record.
 */
export interface IPurchaseOrderChangeRequest {
/** @evidence prisma:purchase_order_change_requests.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:purchase_order_change_requests.purchase_order_id Carries the persisted purchaseOrderId value. */
  purchaseOrderId: string & tags.Format<"uuid">;
/** @evidence prisma:purchase_order_change_requests.requested_total_amount Carries the persisted requestedTotalAmount value. */
  requestedTotalAmount: number;
/** @evidence prisma:purchase_order_change_requests.reason Carries the persisted reason value. */
  reason: string;
/** @evidence prisma:purchase_order_change_requests.status Carries the persisted status value. */
  status: "pending" | "approved" | "rejected" | "applied";
/** @evidence prisma:purchase_order_change_requests.requested_by_user_id Carries the persisted requestedByUserId value. */
  requestedByUserId: string & tags.Format<"uuid">;
/** @evidence prisma:purchase_order_change_requests.decided_by_user_id Carries the persisted decidedByUserId value. */
  decidedByUserId: (string & tags.Format<"uuid">) | null;
/** @evidence prisma:purchase_order_change_requests.applied_at Carries the persisted appliedAt value. */
  appliedAt: (string & tags.Format<"date-time">) | null;
/** @evidence prisma:purchase_order_change_requests.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:purchase_order_change_requests.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPurchaseOrderChangeRequest {
  export interface ICreate { purchaseOrderId: string & tags.Format<"uuid">; requestedTotalAmount: number; reason: string; }
  export interface IRequest extends IPage.IRequest { purchaseOrderId?: string & tags.Format<"uuid">; status?: IPurchaseOrderChangeRequest["status"]; }
  export interface IStatus { status: "approved" | "rejected"; }
}
