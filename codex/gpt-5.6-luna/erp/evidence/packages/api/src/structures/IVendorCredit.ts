import type { tags } from "typia"; import type { IPage } from "../typings";
/** Vendor credit lifecycle, including bank-linked refunds.
 */
/**
 * @evidence prisma:vendor_credits Exposes the persisted vendor_credits record.
 */
export interface IVendorCredit {
  /** @evidence prisma:vendor_credits.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:vendor_credits.vendor_id Carries the persisted vendorId value. */
  vendorId: string & tags.Format<"uuid">;
  /** @evidence prisma:vendor_credits.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:vendor_credits.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:vendor_credits.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:vendor_credits.remaining_amount Carries the persisted remainingAmount value. */
  remainingAmount: number;
  /** @evidence prisma:vendor_credits.refund_bank_account_id Carries the persisted refundBankAccountId value. */
  refundBankAccountId: string | null;
  /** @evidence prisma:vendor_credits.refunded_at Carries the persisted refundedAt value. */
  refundedAt: (string & tags.Format<"date-time">) | null;
  /** @evidence prisma:vendor_credits.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:vendor_credits.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IVendorCredit { export interface ICreate { vendorId: string & tags.Format<"uuid">; amount: number; } export interface IRequest extends IPage.IRequest { vendorId?: string; status?: string; } export interface IStatus { status: "draft" | "approved" | "applied" | "settled" | "refunded" | "void"; refundBankAccountId?: string; } }
