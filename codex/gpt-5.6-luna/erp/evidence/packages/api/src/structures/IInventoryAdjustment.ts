import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:inventory_adjustments Exposes the persisted inventory_adjustments record.
 */
export interface IInventoryAdjustment {
  /** @evidence prisma:inventory_adjustments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:inventory_adjustments.warehouse_id Carries the persisted warehouseId value. */
  warehouseId: string & tags.Format<"uuid">;
  /** @evidence prisma:inventory_adjustments.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:inventory_adjustments.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:inventory_adjustments.reason Carries the persisted reason value. */
  reason: string;
  /** @evidence prisma:inventory_adjustments.total_quantity Carries the persisted totalQuantity value. */
  totalQuantity: number;
  /** @evidence prisma:inventory_adjustments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:inventory_adjustments.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IInventoryAdjustment { export interface ICreate { warehouseId: string & tags.Format<"uuid">; reason: string; totalQuantity: number; } export interface IRequest extends IPage.IRequest { warehouseId?: string; status?: string; } export interface IStatus { status: "draft" | "pending_approval" | "approved" | "posted" | "rejected" | "cancelled"; } }
