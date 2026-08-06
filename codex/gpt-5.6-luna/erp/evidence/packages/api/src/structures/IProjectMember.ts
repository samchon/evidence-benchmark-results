import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:project_members Exposes the persisted project_members record.
 */
export interface IProjectMember {
  /** @evidence prisma:project_members.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:project_members.project_id Carries the persisted projectId value. */
  projectId: string & tags.Format<"uuid">;
  /** @evidence prisma:project_members.employee_id Carries the persisted employeeId value. */
  employeeId: string & tags.Format<"uuid">;
  /** @evidence prisma:project_members.role Carries the persisted role value. */
  role: string;
  /** @evidence prisma:project_members.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:project_members.starts_at Carries the persisted startsAt value. */
  startsAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:project_members.ends_at Carries the persisted endsAt value. */
  endsAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:project_members.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:project_members.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IProjectMember { export interface ICreate { projectId: string & tags.Format<"uuid">; employeeId: string & tags.Format<"uuid">; role: string; startsAt?: null | (string & tags.Format<"date-time">); endsAt?: null | (string & tags.Format<"date-time">); } export interface IRequest extends IPage.IRequest { projectId?: string; employeeId?: string; status?: string; } export interface IStatus { status: "active" | "inactive"; } }
