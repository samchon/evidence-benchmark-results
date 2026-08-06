import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:depreciation_schedules Exposes the persisted depreciation_schedules record.
 */
export interface IDepreciationSchedule {
  /** @evidence prisma:depreciation_schedules.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:depreciation_schedules.fixed_asset_id Carries the persisted fixedAssetId value. */
  fixedAssetId: string & tags.Format<"uuid">;
  /** @evidence prisma:depreciation_schedules.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:depreciation_schedules.starts_at Carries the persisted startsAt value. */
  startsAt: string & tags.Format<"date-time">;
  /** @evidence prisma:depreciation_schedules.ends_at Carries the persisted endsAt value. */
  endsAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:depreciation_schedules.method Carries the persisted method value. */
  method: string;
  /** @evidence prisma:depreciation_schedules.monthly_amount Carries the persisted monthlyAmount value. */
  monthlyAmount: number;
  /** @evidence prisma:depreciation_schedules.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:depreciation_schedules.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IDepreciationSchedule { export interface ICreate { fixedAssetId: string & tags.Format<"uuid">; startsAt: string & tags.Format<"date-time">; endsAt?: null | (string & tags.Format<"date-time">); method: string; monthlyAmount: number; } export interface IRequest extends IPage.IRequest { fixedAssetId?: string; status?: string; } export interface IStatus { status: "draft" | "active" | "inactive"; } }
