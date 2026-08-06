import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:cycle_counts Exposes the persisted cycle_counts record.
 */
export interface ICycleCount {
  /** @evidence prisma:cycle_counts.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:cycle_counts.warehouse_id Carries the persisted warehouseId value. */
  warehouseId: string & tags.Format<"uuid">;
/** @evidence prisma:cycle_counts.number Carries the persisted number value. */
  number: string;
/** @evidence prisma:cycle_counts.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:cycle_counts.count_date Carries the persisted countDate value. */
  countDate: string & tags.Format<"date-time">;
/** @evidence prisma:cycle_counts.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:cycle_counts.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICycleCount { export interface ICreate { warehouseId: string & tags.Format<"uuid">; countDate: string & tags.Format<"date-time">; } export interface IRequest extends IPage.IRequest { warehouseId?: string; status?: string; } export interface IStatus { status: "draft" | "performed" | "submitted" | "approved" | "rejected" | "posted"; } }
