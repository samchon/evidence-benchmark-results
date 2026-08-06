import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:work_centers Exposes the persisted work_centers record.
 */
export interface IWorkCenter {
  /** @evidence prisma:work_centers.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:work_centers.code Carries the persisted code value. */
  code: string;
/** @evidence prisma:work_centers.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:work_centers.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:work_centers.capacity_hours Carries the persisted capacityHours value. */
  capacityHours: number;
/** @evidence prisma:work_centers.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:work_centers.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IWorkCenter { export interface ICreate { code: string; name: string; capacityHours: number; } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "active" | "inactive"; } }
