import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:stock_allocations Exposes the persisted stock_allocations record.
 */
export interface IStockAllocation {
  /** @evidence prisma:stock_allocations.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:stock_allocations.sales_order_line_id Carries the persisted salesOrderLineId value. */
  salesOrderLineId: string & tags.Format<"uuid">;
  /** @evidence prisma:stock_allocations.item_id Carries the persisted itemId value. */
  itemId: string & tags.Format<"uuid">;
  /** @evidence prisma:stock_allocations.warehouse_id Carries the persisted warehouseId value. */
  warehouseId: null | string;
  /** @evidence prisma:stock_allocations.location_id Carries the persisted locationId value. */
  locationId: null | string;
  /** @evidence prisma:stock_allocations.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:stock_allocations.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:stock_allocations.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:stock_allocations.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IStockAllocation { export interface ICreate { salesOrderLineId: string & tags.Format<"uuid">; itemId: string & tags.Format<"uuid">; warehouseId?: null | string; locationId?: null | string; quantity: number; } export interface IRequest extends IPage.IRequest { salesOrderLineId?: string; itemId?: string; status?: string; } export interface IStatus { status: "reserved" | "released" | "consumed"; } }
