import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:purchase_order_lines Exposes the persisted purchase_order_lines record.
 */
export interface IPurchaseOrderLine {
  /** @evidence prisma:purchase_order_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:purchase_order_lines.purchase_order_id Carries the persisted purchaseOrderId value. */
  purchaseOrderId: Id;
  /** @evidence prisma:purchase_order_lines.item_id Carries the persisted itemId value. */
  itemId: null|Id;
  /** @evidence prisma:purchase_order_lines.description Carries the persisted description value. */
  description: string;
  /** @evidence prisma:purchase_order_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:purchase_order_lines.unit_code Carries the persisted unitCode value. */
  unitCode: string;
  /** @evidence prisma:purchase_order_lines.unit_price Carries the persisted unitPrice value. */
  unitPrice: number;
  /** @evidence prisma:purchase_order_lines.received_quantity Carries the persisted receivedQuantity value. */
  receivedQuantity: number;
  /** @evidence prisma:purchase_order_lines.billed_quantity Carries the persisted billedQuantity value. */
  billedQuantity: number;
  /** @evidence prisma:purchase_order_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
  /** @evidence prisma:purchase_order_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string&tags.Format<"date-time">;
} export namespace IPurchaseOrderLine { export interface ICreate { purchaseOrderId:Id; itemId?:null|Id; description:string; quantity:number; unitCode:string; unitPrice:number; } export interface IRequest extends IPage.IRequest { purchaseOrderId?:Id; itemId?:Id; } }
