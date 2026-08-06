import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:profit_centers Exposes the persisted profit_centers record.
 */
export interface IProfitCenter {
  /** @evidence prisma:profit_centers.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:profit_centers.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:profit_centers.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:profit_centers.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:profit_centers.manager_employee_id Carries the persisted managerEmployeeId value. */
  managerEmployeeId: null | string;
  /** @evidence prisma:profit_centers.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:profit_centers.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IProfitCenter { export interface ICreate { code: string; name: string; managerEmployeeId?: null | string; } export interface IRequest extends IPage.IRequest { status?: string; code?: string; } export interface IStatus { status: "active" | "inactive"; } }
