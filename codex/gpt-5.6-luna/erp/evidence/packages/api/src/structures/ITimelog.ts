import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:timelogs Exposes the persisted timelogs record.
 */
export interface ITimelog {
  /** @evidence prisma:timelogs.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:timelogs.employee_id Carries the persisted employeeId value. */
  employeeId: string & tags.Format<"uuid">;
/** @evidence prisma:timelogs.project_id Carries the persisted projectId value. */
  projectId: null | string;
  /** @evidence prisma:timelogs.task_id Carries the persisted task_id value. */
  taskId: null | string;
/** @evidence prisma:timelogs.work_date Carries the persisted workDate value. */
  workDate: string & tags.Format<"date-time">;
  /** @evidence prisma:timelogs.hours Carries the persisted hours value. */
  hours: number;
  /** @evidence prisma:timelogs.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:timelogs.description Carries the persisted description value. */
  description: null | string;
/** @evidence prisma:timelogs.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:timelogs.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ITimelog { export interface ICreate { employeeId: string & tags.Format<"uuid">; projectId?: null | string; taskId?: null | string; workDate: string & tags.Format<"date-time">; hours: number; description?: null | string; } export interface IRequest extends IPage.IRequest { employeeId?: string; projectId?: string; status?: string; } export interface IStatus { status: "draft" | "submitted" | "approved" | "rejected"; } }
