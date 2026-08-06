import type { tags } from "typia";
import type { IPage } from "../typings";

/** Owner-requested, approver-decided fiscal-period reopen.
 */
/**
 * @evidence prisma:period_reopen_requests Exposes the persisted period_reopen_requests record.
 */
export interface IFiscalPeriodReopenRequest {
/** @evidence prisma:period_reopen_requests.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:period_reopen_requests.fiscal_period_id Carries the persisted fiscalPeriodId value. */
  fiscalPeriodId: string & tags.Format<"uuid">;
/** @evidence prisma:period_reopen_requests.reason Carries the persisted reason value. */
  reason: string;
/** @evidence prisma:period_reopen_requests.status Carries the persisted status value. */
  status: "pending" | "approved" | "rejected" | "applied";
/** @evidence prisma:period_reopen_requests.requested_by_user_id Carries the persisted requestedByUserId value. */
  requestedByUserId: string & tags.Format<"uuid">;
/** @evidence prisma:period_reopen_requests.decided_by_user_id Carries the persisted decidedByUserId value. */
  decidedByUserId: (string & tags.Format<"uuid">) | null;
/** @evidence prisma:period_reopen_requests.applied_at Carries the persisted appliedAt value. */
  appliedAt: (string & tags.Format<"date-time">) | null;
/** @evidence prisma:period_reopen_requests.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:period_reopen_requests.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IFiscalPeriodReopenRequest {
  export interface ICreate { fiscalPeriodId: string & tags.Format<"uuid">; reason: string; }
  export interface IRequest extends IPage.IRequest { fiscalPeriodId?: string & tags.Format<"uuid">; status?: IFiscalPeriodReopenRequest["status"]; }
  export interface IStatus { status: "approved" | "rejected"; }
}
