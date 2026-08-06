import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:vendor_payments Exposes the persisted vendor_payments record.
 */
export interface IVendorPayment {
  /** @evidence prisma:vendor_payments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:vendor_payments.vendor_id Carries the persisted vendorId value. */
  vendorId: string & tags.Format<"uuid">;
  /** @evidence prisma:vendor_payments.bank_account_id Carries the persisted bankAccountId value. */
  bankAccountId: null | string;
  /** @evidence prisma:vendor_payments.payment_date Carries the persisted paymentDate value. */
  paymentDate: string & tags.Format<"date-time">;
  /** @evidence prisma:vendor_payments.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:vendor_payments.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:vendor_payments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:vendor_payments.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IVendorPayment { export interface ICreate { vendorId: string & tags.Format<"uuid">; bankAccountId?: null | string; paymentDate: string & tags.Format<"date-time">; amount: number; } export interface IRequest extends IPage.IRequest { vendorId?: string; status?: string; } export interface IStatus { status: "draft" | "approved" | "posted" | "void" | "reversed"; } }
