import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:sales_invoices Exposes the persisted sales_invoices record.
 */
export interface ISalesInvoice {
  /** @evidence prisma:sales_invoices.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:sales_invoices.customer_id Carries the persisted customerId value. */
  customerId: string & tags.Format<"uuid">;
  /** @evidence prisma:sales_invoices.sales_order_id Carries the persisted salesOrderId value. */
  salesOrderId: null | string;
  /** @evidence prisma:sales_invoices.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:sales_invoices.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:sales_invoices.invoice_date Carries the persisted invoiceDate value. */
  invoiceDate: string & tags.Format<"date-time">;
  /** @evidence prisma:sales_invoices.due_date Carries the persisted dueDate value. */
  dueDate: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:sales_invoices.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
  /** @evidence prisma:sales_invoices.paid_amount Carries the persisted paidAmount value. */
  paidAmount: number;
  /** @evidence prisma:sales_invoices.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:sales_invoices.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ISalesInvoice { export interface ICreate { customerId: string & tags.Format<"uuid">; salesOrderId?: null | string; invoiceDate: string & tags.Format<"date-time">; dueDate?: null | (string & tags.Format<"date-time">); totalAmount: number; } export interface IRequest extends IPage.IRequest { customerId?: string; status?: string; } export interface IStatus { status: "draft" | "approved" | "posted" | "partly_paid" | "paid" | "void"; } }
