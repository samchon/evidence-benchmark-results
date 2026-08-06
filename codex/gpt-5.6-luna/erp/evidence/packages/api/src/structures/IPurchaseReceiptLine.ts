import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:purchase_receipt_lines Exposes the persisted purchase_receipt_lines record.
 */
export interface IPurchaseReceiptLine {
  /** @evidence prisma:purchase_receipt_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:purchase_receipt_lines.purchase_receipt_id Carries the persisted purchaseReceiptId value. */
  purchaseReceiptId: Id;
  /** @evidence prisma:purchase_receipt_lines.purchase_order_line_id Carries the persisted purchaseOrderLineId value. */
  purchaseOrderLineId: Id;
  /** @evidence prisma:purchase_receipt_lines.item_id Carries the persisted itemId value. */
  itemId: null|Id;
  /** @evidence prisma:purchase_receipt_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:purchase_receipt_lines.warehouse_id Carries the persisted warehouseId value. */
  warehouseId: null|Id;
  /** @evidence prisma:purchase_receipt_lines.location_id Carries the persisted locationId value. */
  locationId: null|Id;
  /** @evidence prisma:purchase_receipt_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
  /** @evidence prisma:purchase_receipt_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string&tags.Format<"date-time">;
} export namespace IPurchaseReceiptLine { export interface ICreate { purchaseReceiptId:Id; purchaseOrderLineId:Id; itemId?:null|Id; quantity:number; warehouseId?:null|Id; locationId?:null|Id; } export interface IRequest extends IPage.IRequest { purchaseReceiptId?:Id; purchaseOrderLineId?:Id; } }
