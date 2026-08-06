import type { tags } from "typia"; import type { IPage } from "../typings";
/** Sales return lifecycle and retained refund source.
 */
/**
 * @evidence prisma:sales_returns Exposes the persisted sales_returns record.
 */
export interface ISalesReturn {
  /** @evidence prisma:sales_returns.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:sales_returns.sales_order_id Carries the persisted salesOrderId value. */
  salesOrderId: null | string;
/** @evidence prisma:sales_returns.number Carries the persisted number value. */
  number: string;
/** @evidence prisma:sales_returns.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:sales_returns.return_date Carries the persisted returnDate value. */
  returnDate: string & tags.Format<"date-time">;
/** @evidence prisma:sales_returns.reason Carries the persisted reason value. */
  reason: null | string;
/** @evidence prisma:sales_returns.refund_credit_memo_id Carries the persisted refundCreditMemoId value. */
  refundCreditMemoId: string | null;
/** @evidence prisma:sales_returns.refund_customer_payment_id Carries the persisted refundCustomerPaymentId value. */
  refundCustomerPaymentId: string | null;
/** @evidence prisma:sales_returns.refunded_at Carries the persisted refundedAt value. */
  refundedAt: (string & tags.Format<"date-time">) | null;
/** @evidence prisma:sales_returns.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:sales_returns.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ISalesReturn { export interface ICreate { salesOrderId?: null | string; returnDate: string & tags.Format<"date-time">; reason?: null | string; } export interface IRequest extends IPage.IRequest { salesOrderId?: string; status?: string; } export interface IStatus { status: "draft" | "approved" | "posted" | "rejected" | "refunded" | "void"; refundCreditMemoId?: string; refundCustomerPaymentId?: string; } }
