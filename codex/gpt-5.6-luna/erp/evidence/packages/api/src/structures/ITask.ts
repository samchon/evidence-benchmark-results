import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:tasks Exposes the persisted tasks record.
 */
export interface ITask {
  /** @evidence prisma:tasks.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:tasks.project_id Carries the persisted project_id value. */
  projectId: null | string;
/** @evidence prisma:tasks.assignee_employee_id Carries the persisted assigneeEmployeeId value. */
  assigneeEmployeeId: null | string;
  /** @evidence prisma:tasks.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:tasks.title Carries the persisted title value. */
  title: string;
  /** @evidence prisma:tasks.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:tasks.priority Carries the persisted priority value. */
  priority: string;
  /** @evidence prisma:tasks.due_at Carries the persisted due_at value. */
  dueAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:tasks.estimate_hours Carries the persisted estimateHours value. */
  estimateHours: null | number;
  /** @evidence prisma:tasks.created_at Carries the persisted created_at value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:tasks.updated_at Carries the persisted updated_at value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ITask { export interface ICreate { projectId?: null | string; assigneeEmployeeId?: null | string; code: string; title: string; priority?: string; dueAt?: null | (string & tags.Format<"date-time">); estimateHours?: null | number; } export interface IRequest extends IPage.IRequest { projectId?: string; status?: string; } export interface IStatus { status: "open" | "in_progress" | "done" | "cancelled"; } }
