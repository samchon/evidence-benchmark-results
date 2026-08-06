import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization department. */
/**
 * @evidence prisma:departments Exposes the persisted departments record.
 */
export interface IDepartment {
  /** @evidence prisma:departments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:departments.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:departments.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:departments.manager_user_id Carries the persisted managerUserId value. */
  managerUserId: null | string;
/** @evidence prisma:departments.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:departments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:departments.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IDepartment { export interface ICreate { code: string & tags.MinLength<1>; name: string & tags.MinLength<1>; managerUserId?: null | string; } export interface IUpdate { name?: string; managerUserId?: null | string; } export interface IRequest extends IPage.IRequest { search?: string; includeInactive?: boolean; } }
