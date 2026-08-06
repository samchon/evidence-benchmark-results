import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:maintenance_plans Exposes the persisted maintenance_plans record.
 */
export interface IMaintenancePlan {
  /** @evidence prisma:maintenance_plans.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:maintenance_plans.equipment_id Carries the persisted equipmentId value. */
  equipmentId: string & tags.Format<"uuid">;
  /** @evidence prisma:maintenance_plans.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:maintenance_plans.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:maintenance_plans.interval_days Carries the persisted intervalDays value. */
  intervalDays: null | number;
  /** @evidence prisma:maintenance_plans.next_due_at Carries the persisted nextDueAt value. */
  nextDueAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:maintenance_plans.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:maintenance_plans.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IMaintenancePlan { export interface ICreate { equipmentId: string & tags.Format<"uuid">; name: string; intervalDays?: null | number; nextDueAt?: null | (string & tags.Format<"date-time">); } export interface IRequest extends IPage.IRequest { equipmentId?: string; status?: string; } export interface IStatus { status: "draft" | "active" | "inactive"; } }
