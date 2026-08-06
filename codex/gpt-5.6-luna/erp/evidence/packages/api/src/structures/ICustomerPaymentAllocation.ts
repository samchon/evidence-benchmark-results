import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:customer_payment_allocations Exposes the persisted customer_payment_allocations record.
 */
export interface ICustomerPaymentAllocation {
  /** @evidence prisma:customer_payment_allocations.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:customer_payment_allocations.customer_payment_id Carries the persisted customerPaymentId value. */
  customerPaymentId: Id;
  /** @evidence prisma:customer_payment_allocations.sales_invoice_id Carries the persisted salesInvoiceId value. */
  salesInvoiceId: Id;
  /** @evidence prisma:customer_payment_allocations.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:customer_payment_allocations.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
} export namespace ICustomerPaymentAllocation { export interface ICreate { customerPaymentId:Id; salesInvoiceId:Id; amount:number; } export interface IRequest extends IPage.IRequest { customerPaymentId?:Id; salesInvoiceId?:Id; } }
