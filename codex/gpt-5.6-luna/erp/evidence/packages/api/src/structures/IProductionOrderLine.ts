import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:production_order_lines Exposes the persisted production_order_lines record.
 */
export interface IProductionOrderLine {
  /** @evidence prisma:production_order_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:production_order_lines.production_order_id Carries the persisted productionOrderId value. */
  productionOrderId: Id;
  /** @evidence prisma:production_order_lines.item_id Carries the persisted itemId value. */
  itemId: Id;
  /** @evidence prisma:production_order_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:production_order_lines.issued_quantity Carries the persisted issuedQuantity value. */
  issuedQuantity: number;
  /** @evidence prisma:production_order_lines.consumed_quantity Carries the persisted consumedQuantity value. */
  consumedQuantity: number;
  /** @evidence prisma:production_order_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
  /** @evidence prisma:production_order_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string&tags.Format<"date-time">;
} export namespace IProductionOrderLine { export interface ICreate { productionOrderId:Id; itemId:Id; quantity:number; } export interface IRequest extends IPage.IRequest { productionOrderId?:Id; itemId?:Id; } }
