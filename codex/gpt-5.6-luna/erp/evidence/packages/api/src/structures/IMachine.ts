import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:machines Exposes the persisted machines record.
 */
export interface IMachine {
  /** @evidence prisma:machines.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:machines.work_center_id Carries the persisted workCenterId value. */
  workCenterId: null | string;
  /** @evidence prisma:machines.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:machines.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:machines.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:machines.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:machines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IMachine { export interface ICreate { workCenterId?: null | string; code: string; name: string; } export interface IRequest extends IPage.IRequest { workCenterId?: string; status?: string; } export interface IStatus { status: "active" | "inactive"; } }
