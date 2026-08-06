import type { tags } from "typia"; import type { IPage } from "../typings";
/** Customer credit memo lifecycle, including bank-linked refunds.
 */
/**
 * @evidence prisma:credit_memos Exposes the persisted credit_memos record.
 */
export interface ICreditMemo {
  /** @evidence prisma:credit_memos.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:credit_memos.customer_id Carries the persisted customerId value. */
  customerId: string & tags.Format<"uuid">;
/** @evidence prisma:credit_memos.sales_invoice_id Carries the persisted salesInvoiceId value. */
  salesInvoiceId: null | string;
/** @evidence prisma:credit_memos.number Carries the persisted number value. */
  number: string;
/** @evidence prisma:credit_memos.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:credit_memos.amount Carries the persisted amount value. */
  amount: number;
/** @evidence prisma:credit_memos.remaining_amount Carries the persisted remainingAmount value. */
  remainingAmount: number;
/** @evidence prisma:credit_memos.refund_bank_account_id Carries the persisted refundBankAccountId value. */
  refundBankAccountId: string | null;
/** @evidence prisma:credit_memos.refunded_at Carries the persisted refundedAt value. */
  refundedAt: (string & tags.Format<"date-time">) | null;
/** @evidence prisma:credit_memos.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:credit_memos.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICreditMemo { export interface ICreate { customerId: string & tags.Format<"uuid">; salesInvoiceId?: null | string; amount: number; } export interface IRequest extends IPage.IRequest { customerId?: string; status?: string; } export interface IStatus { status: "draft" | "approved" | "applied" | "settled" | "refunded" | "void"; refundBankAccountId?: string; } }
