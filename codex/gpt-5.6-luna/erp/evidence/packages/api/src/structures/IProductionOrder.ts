import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:production_orders Exposes the persisted production_orders record.
 */
export interface IProductionOrder {
  /** @evidence prisma:production_orders.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:production_orders.item_id Carries the persisted itemId value. */
  itemId: string & tags.Format<"uuid">;
  /** @evidence prisma:production_orders.bom_id Carries the persisted bomId value. */
  bomId: null | string;
  /** @evidence prisma:production_orders.routing_id Carries the persisted routingId value. */
  routingId: null | string;
  /** @evidence prisma:production_orders.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:production_orders.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:production_orders.planned_quantity Carries the persisted plannedQuantity value. */
  plannedQuantity: number;
  /** @evidence prisma:production_orders.produced_quantity Carries the persisted producedQuantity value. */
  producedQuantity: number;
  /** @evidence prisma:production_orders.due_date Carries the persisted dueDate value. */
  dueDate: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:production_orders.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:production_orders.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IProductionOrder { export interface ICreate { itemId: string & tags.Format<"uuid">; bomId?: null | string; routingId?: null | string; plannedQuantity: number; dueDate?: null | (string & tags.Format<"date-time">); } export interface IRequest extends IPage.IRequest { itemId?: string; status?: string; } export interface IStatus { status: "draft" | "released" | "in_progress" | "completed" | "cancelled"; } }
