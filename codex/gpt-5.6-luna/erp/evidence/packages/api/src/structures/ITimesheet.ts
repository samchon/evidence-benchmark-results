import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:timesheets Exposes the persisted timesheets record.
 */
export interface ITimesheet {
  /** @evidence prisma:timesheets.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:timesheets.employee_id Carries the persisted employeeId value. */
  employeeId: string & tags.Format<"uuid">;
/** @evidence prisma:timesheets.period_start Carries the persisted periodStart value. */
  periodStart: string & tags.Format<"date-time">;
/** @evidence prisma:timesheets.period_end Carries the persisted periodEnd value. */
  periodEnd: string & tags.Format<"date-time">;
/** @evidence prisma:timesheets.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:timesheets.total_hours Carries the persisted totalHours value. */
  totalHours: number;
/** @evidence prisma:timesheets.submitted_at Carries the persisted submittedAt value. */
  submittedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:timesheets.approved_at Carries the persisted approvedAt value. */
  approvedAt: null | (string & tags.Format<"date-time">);
}
export namespace ITimesheet { export interface ICreate { employeeId: string & tags.Format<"uuid">; periodStart: string & tags.Format<"date-time">; periodEnd: string & tags.Format<"date-time">; totalHours: number; } export interface IRequest extends IPage.IRequest { employeeId?: string; status?: string; } export interface IStatus { status: "draft" | "submitted" | "approved" | "rejected"; } }
