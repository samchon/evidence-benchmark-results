import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:cost_centers Exposes the persisted cost_centers record.
 */
export interface ICostCenter {
  /** @evidence prisma:cost_centers.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:cost_centers.code Carries the persisted code value. */
  code: string;
/** @evidence prisma:cost_centers.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:cost_centers.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:cost_centers.manager_employee_id Carries the persisted managerEmployeeId value. */
  managerEmployeeId: null | string;
/** @evidence prisma:cost_centers.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:cost_centers.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICostCenter { export interface ICreate { code: string; name: string; managerEmployeeId?: null | string; } export interface IRequest extends IPage.IRequest { status?: string; code?: string; } export interface IStatus { status: "active" | "inactive"; } }
