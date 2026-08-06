import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:mrp_runs Exposes the persisted mrp_runs record.
 */
export interface IMrpRun {
  /** @evidence prisma:mrp_runs.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:mrp_runs.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:mrp_runs.run_date Carries the persisted runDate value. */
  runDate: string & tags.Format<"date-time">;
/** @evidence prisma:mrp_runs.horizon_end Carries the persisted horizonEnd value. */
  horizonEnd: null | (string & tags.Format<"date-time">);
/** @evidence prisma:mrp_runs.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:mrp_runs.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IMrpRun { export interface ICreate { runDate: string & tags.Format<"date-time">; horizonEnd?: null | (string & tags.Format<"date-time">); } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "draft" | "running" | "completed" | "failed"; } }
