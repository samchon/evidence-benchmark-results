import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:payroll_runs Exposes the persisted payroll_runs record.
 */
export interface IPayrollRun {
  /** @evidence prisma:payroll_runs.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:payroll_runs.pay_schedule_id Carries the persisted payScheduleId value. */
  payScheduleId: string & tags.Format<"uuid">;
/** @evidence prisma:payroll_runs.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:payroll_runs.run_date Carries the persisted runDate value. */
  runDate: string & tags.Format<"date-time">;
/** @evidence prisma:payroll_runs.total_gross Carries the persisted totalGross value. */
  totalGross: number;
/** @evidence prisma:payroll_runs.total_net Carries the persisted totalNet value. */
  totalNet: number;
/** @evidence prisma:payroll_runs.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:payroll_runs.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPayrollRun { export interface ICreate { payScheduleId: string & tags.Format<"uuid">; totalGross: number; totalNet: number; } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "draft" | "calculated" | "approved" | "posted" | "cancelled"; } }
