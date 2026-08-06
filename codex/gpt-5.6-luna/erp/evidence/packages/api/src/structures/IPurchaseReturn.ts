import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:purchase_returns Exposes the persisted purchase_returns record.
 */
export interface IPurchaseReturn {
  /** @evidence prisma:purchase_returns.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_returns.purchase_receipt_id Carries the persisted purchaseReceiptId value. */
  purchaseReceiptId: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_returns.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:purchase_returns.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:purchase_returns.return_date Carries the persisted returnDate value. */
  returnDate: string & tags.Format<"date-time">;
  /** @evidence prisma:purchase_returns.reason Carries the persisted reason value. */
  reason: null | string;
  /** @evidence prisma:purchase_returns.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:purchase_returns.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPurchaseReturn { export interface ICreate { purchaseReceiptId: string & tags.Format<"uuid">; returnDate: string & tags.Format<"date-time">; reason?: null | string; receiptLineId?: null | string; quantity?: number; } export interface IRequest extends IPage.IRequest { purchaseReceiptId?: string; status?: string; } export interface IStatus { status: "draft" | "posted" | "cancelled"; } }
