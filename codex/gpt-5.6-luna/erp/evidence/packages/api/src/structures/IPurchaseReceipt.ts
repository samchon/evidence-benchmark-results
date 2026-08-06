import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:purchase_receipts Exposes the persisted purchase_receipts record.
 */
export interface IPurchaseReceipt {
  /** @evidence prisma:purchase_receipts.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_receipts.purchase_order_id Carries the persisted purchaseOrderId value. */
  purchaseOrderId: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_receipts.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:purchase_receipts.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:purchase_receipts.receipt_date Carries the persisted receiptDate value. */
  receiptDate: string & tags.Format<"date-time">;
  /** @evidence prisma:purchase_receipts.posted_at Carries the persisted postedAt value. */
  postedAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:purchase_receipts.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:purchase_receipts.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPurchaseReceipt { export interface ICreate { purchaseOrderId: string & tags.Format<"uuid">; receiptDate: string & tags.Format<"date-time">; } export interface IRequest extends IPage.IRequest { purchaseOrderId?: string; status?: string; } export interface IStatus { status: "draft" | "posted" | "void"; } }
