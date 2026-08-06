import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:sales_invoice_lines Exposes the persisted sales_invoice_lines record.
 */
export interface ISalesInvoiceLine {
  /** @evidence prisma:sales_invoice_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:sales_invoice_lines.sales_invoice_id Carries the persisted salesInvoiceId value. */
  salesInvoiceId: Id;
  /** @evidence prisma:sales_invoice_lines.sales_order_line_id Carries the persisted salesOrderLineId value. */
  salesOrderLineId: null|Id;
  /** @evidence prisma:sales_invoice_lines.description Carries the persisted description value. */
  description: string;
  /** @evidence prisma:sales_invoice_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:sales_invoice_lines.unit_price Carries the persisted unitPrice value. */
  unitPrice: number;
  /** @evidence prisma:sales_invoice_lines.tax_amount Carries the persisted taxAmount value. */
  taxAmount: number;
  /** @evidence prisma:sales_invoice_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
  /** @evidence prisma:sales_invoice_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string&tags.Format<"date-time">;
} export namespace ISalesInvoiceLine { export interface ICreate { salesInvoiceId:Id; salesOrderLineId?:null|Id; description:string; quantity:number; unitPrice:number; taxAmount?:number; } export interface IRequest extends IPage.IRequest { salesInvoiceId?:Id; salesOrderLineId?:Id; } }
