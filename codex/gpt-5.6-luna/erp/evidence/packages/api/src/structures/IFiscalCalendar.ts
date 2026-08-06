import type { tags } from "typia";
import type { IPage } from "../typings";
/** Fiscal calendar and ordered posting periods. */
/**
 * @evidence prisma:fiscal_calendars Exposes the persisted fiscal_calendars record.
 */
export interface IFiscalCalendar {
  /** @evidence prisma:fiscal_calendars.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:fiscal_calendars.fiscal_year Carries the persisted fiscalYear value. */
  fiscalYear: number;
  /** @evidence prisma:fiscal_calendars.start_month Carries the persisted startMonth value. */
  startMonth: number;
  /** @evidence prisma:fiscal_calendars.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  periods: import("./IFiscalPeriod").IFiscalPeriod[];
}
export namespace IFiscalCalendar { export interface ICreate { fiscalYear: number; startMonth: number & tags.Minimum<1> & tags.Maximum<12>; } export interface IRequest extends IPage.IRequest { fiscalYear?: number; } }
