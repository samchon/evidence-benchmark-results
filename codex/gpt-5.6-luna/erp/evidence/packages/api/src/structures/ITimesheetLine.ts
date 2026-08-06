import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:timesheet_lines Exposes the persisted timesheet_lines record.
 */
export interface ITimesheetLine {
  /** @evidence prisma:timesheet_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:timesheet_lines.timesheet_id Carries the persisted timesheetId value. */
  timesheetId: Id;
  /** @evidence prisma:timesheet_lines.timelog_id Carries the persisted timelogId value. */
  timelogId: Id;
  /** @evidence prisma:timesheet_lines.hours Carries the persisted hours value. */
  hours: number;
  /** @evidence prisma:timesheet_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
} export namespace ITimesheetLine { export interface ICreate { timesheetId:Id; timelogId:Id; hours:number; } export interface IRequest extends IPage.IRequest { timesheetId?:Id; timelogId?:Id; } }
