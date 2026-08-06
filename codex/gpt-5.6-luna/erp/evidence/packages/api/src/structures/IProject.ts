import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:projects Exposes the persisted projects record.
 */
export interface IProject {
  /** @evidence prisma:projects.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:projects.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:projects.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:projects.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:projects.manager_employee_id Carries the persisted managerEmployeeId value. */
  managerEmployeeId: null | string;
/** @evidence prisma:projects.starts_at Carries the persisted startsAt value. */
  startsAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:projects.ends_at Carries the persisted ends_at value. */
  endsAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:projects.budget_amount Carries the persisted budgetAmount value. */
  budgetAmount: null | number;
/** @evidence prisma:projects.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:projects.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IProject { export interface ICreate { code: string; name: string; managerEmployeeId?: null | string; startsAt?: null | (string & tags.Format<"date-time">); endsAt?: null | (string & tags.Format<"date-time">); budgetAmount?: null | number; } export interface IRequest extends IPage.IRequest { status?: string; search?: string; } export interface IStatus { status: "planned" | "active" | "completed" | "cancelled"; } }
