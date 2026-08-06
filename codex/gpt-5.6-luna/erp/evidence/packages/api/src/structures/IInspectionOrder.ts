import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:inspection_orders Exposes the persisted inspection_orders record.
 */
export interface IInspectionOrder {
  /** @evidence prisma:inspection_orders.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:inspection_orders.inspection_plan_id Carries the persisted inspectionPlanId value. */
  inspectionPlanId: null | string;
  /** @evidence prisma:inspection_orders.source_type Carries the persisted sourceType value. */
  sourceType: string;
  /** @evidence prisma:inspection_orders.source_id Carries the persisted sourceId value. */
  sourceId: string;
  /** @evidence prisma:inspection_orders.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:inspection_orders.inspected_at Carries the persisted inspectedAt value. */
  inspectedAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:inspection_orders.result Carries the persisted result value. */
  result: null | string;
  /** @evidence prisma:inspection_orders.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:inspection_orders.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IInspectionOrder { export interface ICreate { inspectionPlanId?: null | string; sourceType: string; sourceId: string; } export interface IRequest extends IPage.IRequest { status?: string; sourceType?: string; } export interface IStatus { status: "open" | "performed" | "passed" | "failed" | "cancelled"; result?: null | string; } }
