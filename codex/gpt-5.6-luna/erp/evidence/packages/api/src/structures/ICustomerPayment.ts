import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:customer_payments Exposes the persisted customer_payments record.
 */
export interface ICustomerPayment {
  /** @evidence prisma:customer_payments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:customer_payments.customer_id Carries the persisted customerId value. */
  customerId: string & tags.Format<"uuid">;
  /** @evidence prisma:customer_payments.bank_account_id Carries the persisted bankAccountId value. */
  bankAccountId: null | string;
  /** @evidence prisma:customer_payments.payment_date Carries the persisted paymentDate value. */
  paymentDate: string & tags.Format<"date-time">;
  /** @evidence prisma:customer_payments.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:customer_payments.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:customer_payments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:customer_payments.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICustomerPayment { export interface ICreate { customerId: string & tags.Format<"uuid">; bankAccountId?: null | string; paymentDate: string & tags.Format<"date-time">; amount: number; } export interface IRequest extends IPage.IRequest { customerId?: string; status?: string; } export interface IStatus { status: "draft" | "approved" | "posted" | "void" | "reversed"; } }
