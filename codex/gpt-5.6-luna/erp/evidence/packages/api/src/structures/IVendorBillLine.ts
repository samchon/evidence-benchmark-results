import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:vendor_bill_lines Exposes the persisted vendor_bill_lines record.
 */
export interface IVendorBillLine {
  /** @evidence prisma:vendor_bill_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:vendor_bill_lines.vendor_bill_id Carries the persisted vendorBillId value. */
  vendorBillId: Id;
  /** @evidence prisma:vendor_bill_lines.purchase_order_line_id Carries the persisted purchaseOrderLineId value. */
  purchaseOrderLineId: null|Id;
  /** @evidence prisma:vendor_bill_lines.description Carries the persisted description value. */
  description: string;
  /** @evidence prisma:vendor_bill_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:vendor_bill_lines.unit_price Carries the persisted unitPrice value. */
  unitPrice: number;
  /** @evidence prisma:vendor_bill_lines.tax_amount Carries the persisted taxAmount value. */
  taxAmount: number;
  /** @evidence prisma:vendor_bill_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
  /** @evidence prisma:vendor_bill_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string&tags.Format<"date-time">;
} export namespace IVendorBillLine { export interface ICreate { vendorBillId:Id; purchaseOrderLineId?:null|Id; description:string; quantity:number; unitPrice:number; taxAmount?:number; } export interface IRequest extends IPage.IRequest { vendorBillId?:Id; purchaseOrderLineId?:Id; } }
