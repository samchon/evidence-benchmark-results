import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:sales_orders Exposes the persisted sales_orders record.
 */
export interface ISalesOrder {
  /** @evidence prisma:sales_orders.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:sales_orders.customer_id Carries the persisted customerId value. */
  customerId: string & tags.Format<"uuid">;
/** @evidence prisma:sales_orders.sales_quote_id Carries the persisted salesQuoteId value. */
  salesQuoteId: null | string;
/** @evidence prisma:sales_orders.number Carries the persisted number value. */
  number: string;
/** @evidence prisma:sales_orders.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:sales_orders.order_date Carries the persisted orderDate value. */
  orderDate: string & tags.Format<"date-time">;
/** @evidence prisma:sales_orders.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
/** @evidence prisma:sales_orders.allocated_amount Carries the persisted allocatedAmount value. */
  allocatedAmount: number;
/** @evidence prisma:sales_orders.shipped_amount Carries the persisted shippedAmount value. */
  shippedAmount: number;
/** @evidence prisma:sales_orders.invoiced_amount Carries the persisted invoicedAmount value. */
  invoicedAmount: number;
/** @evidence prisma:sales_orders.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:sales_orders.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ISalesOrder { export interface ICreate { customerId: string & tags.Format<"uuid">; salesQuoteId?: null | string; totalAmount: number; } export interface IRequest extends IPage.IRequest { customerId?: string; status?: string; } export interface IStatus { status: "draft" | "routed" | "approved" | "rejected" | "returned" | "confirmed" | "closed"; } }
