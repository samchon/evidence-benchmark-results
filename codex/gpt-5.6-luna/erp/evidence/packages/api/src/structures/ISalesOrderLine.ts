import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:sales_order_lines Exposes the persisted sales_order_lines record.
 */
export interface ISalesOrderLine {
  /** @evidence prisma:sales_order_lines.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:sales_order_lines.sales_order_id Carries the persisted salesOrderId value. */
  salesOrderId: string & tags.Format<"uuid">;
  /** @evidence prisma:sales_order_lines.item_id Carries the persisted itemId value. */
  itemId: null | string;
  /** @evidence prisma:sales_order_lines.description Carries the persisted description value. */
  description: string;
  /** @evidence prisma:sales_order_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:sales_order_lines.unit_price Carries the persisted unitPrice value. */
  unitPrice: number;
  /** @evidence prisma:sales_order_lines.allocated_quantity Carries the persisted allocatedQuantity value. */
  allocatedQuantity: number;
  /** @evidence prisma:sales_order_lines.shipped_quantity Carries the persisted shippedQuantity value. */
  shippedQuantity: number;
  /** @evidence prisma:sales_order_lines.invoiced_quantity Carries the persisted invoicedQuantity value. */
  invoicedQuantity: number;
  /** @evidence prisma:sales_order_lines.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:sales_order_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ISalesOrderLine { export interface ICreate { salesOrderId: string & tags.Format<"uuid">; itemId?: null | string; description: string; quantity: number; unitPrice: number; } export interface IRequest extends IPage.IRequest { salesOrderId?: string; itemId?: string; } }
