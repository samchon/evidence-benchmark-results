import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:depreciation_runs Exposes the persisted depreciation_runs record.
 */
export interface IDepreciationRun {
  /** @evidence prisma:depreciation_runs.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:depreciation_runs.period_start Carries the persisted periodStart value. */
  periodStart: string & tags.Format<"date-time">;
  /** @evidence prisma:depreciation_runs.period_end Carries the persisted periodEnd value. */
  periodEnd: string & tags.Format<"date-time">;
  /** @evidence prisma:depreciation_runs.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:depreciation_runs.posted_at Carries the persisted postedAt value. */
  postedAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:depreciation_runs.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
  /** @evidence prisma:depreciation_runs.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:depreciation_runs.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IDepreciationRun { export interface ICreate { periodStart: string & tags.Format<"date-time">; periodEnd: string & tags.Format<"date-time">; totalAmount: number; } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "draft" | "calculated" | "posted" | "reversed"; } }
