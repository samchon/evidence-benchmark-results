import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:purchase_orders Exposes the persisted purchase_orders record.
 */
export interface IPurchaseOrder {
  /** @evidence prisma:purchase_orders.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_orders.vendor_id Carries the persisted vendorId value. */
  vendorId: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_orders.purchase_request_id Carries the persisted purchaseRequestId value. */
  purchaseRequestId: null | string;
  /** @evidence prisma:purchase_orders.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:purchase_orders.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:purchase_orders.order_date Carries the persisted orderDate value. */
  orderDate: string & tags.Format<"date-time">;
  /** @evidence prisma:purchase_orders.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
  /** @evidence prisma:purchase_orders.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
  lineIds: Array<string & tags.Format<"uuid">>;
  /** @evidence prisma:purchase_orders.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:purchase_orders.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPurchaseOrder { export interface ICreate { vendorId: string & tags.Format<"uuid">; purchaseRequestId?: null | string; currencyCode: string; totalAmount: number; } export interface IRequest extends IPage.IRequest { status?: string; vendorId?: string; } export interface IStatus { status: "routed" | "approved" | "rejected" | "returned" | "sent" | "closed"; } }
