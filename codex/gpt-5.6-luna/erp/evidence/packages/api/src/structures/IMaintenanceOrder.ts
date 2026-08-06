import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:maintenance_orders Exposes the persisted maintenance_orders record.
 */
export interface IMaintenanceOrder {
  /** @evidence prisma:maintenance_orders.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:maintenance_orders.equipment_id Carries the persisted equipmentId value. */
  equipmentId: string & tags.Format<"uuid">;
  /** @evidence prisma:maintenance_orders.maintenance_plan_id Carries the persisted maintenancePlanId value. */
  maintenancePlanId: null | string;
  /** @evidence prisma:maintenance_orders.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:maintenance_orders.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:maintenance_orders.priority Carries the persisted priority value. */
  priority: string;
  /** @evidence prisma:maintenance_orders.scheduled_at Carries the persisted scheduledAt value. */
  scheduledAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:maintenance_orders.completed_at Carries the persisted completedAt value. */
  completedAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:maintenance_orders.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:maintenance_orders.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IMaintenanceOrder { export interface ICreate { equipmentId: string & tags.Format<"uuid">; maintenancePlanId?: null | string; priority: string; scheduledAt?: null | (string & tags.Format<"date-time">); } export interface IRequest extends IPage.IRequest { equipmentId?: string; status?: string; } export interface IStatus { status: "draft" | "scheduled" | "in_progress" | "completed" | "cancelled"; } }
