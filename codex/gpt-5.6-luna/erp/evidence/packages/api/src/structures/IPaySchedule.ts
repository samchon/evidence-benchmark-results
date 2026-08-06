import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:pay_schedules Exposes the persisted pay_schedules record.
 */
export interface IPaySchedule {
  /** @evidence prisma:pay_schedules.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:pay_schedules.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:pay_schedules.frequency Carries the persisted frequency value. */
  frequency: string;
/** @evidence prisma:pay_schedules.period_start Carries the persisted periodStart value. */
  periodStart: string & tags.Format<"date-time">;
/** @evidence prisma:pay_schedules.period_end Carries the persisted periodEnd value. */
  periodEnd: string & tags.Format<"date-time">;
/** @evidence prisma:pay_schedules.pay_date Carries the persisted payDate value. */
  payDate: string & tags.Format<"date-time">;
/** @evidence prisma:pay_schedules.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:pay_schedules.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:pay_schedules.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPaySchedule { export interface ICreate { name: string; frequency: string; periodStart: string & tags.Format<"date-time">; periodEnd: string & tags.Format<"date-time">; payDate: string & tags.Format<"date-time">; } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "open" | "locked" | "paid" | "cancelled"; } }
