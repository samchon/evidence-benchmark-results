import type { tags } from "typia";
import type { IPage } from "../typings";

/** Organization tax return and its filing version. */
/**
 * @evidence prisma:tax_returns Exposes the persisted tax_returns record.
 */
export interface ITaxReturn {
  /** @evidence prisma:tax_returns.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
/** @evidence prisma:tax_returns.jurisdiction_id Carries the persisted jurisdictionId value. */
  jurisdictionId: string & tags.Format<"uuid">;
/** @evidence prisma:tax_returns.period_start Carries the persisted periodStart value. */
  periodStart: string & tags.Format<"date-time">;
/** @evidence prisma:tax_returns.period_end Carries the persisted periodEnd value. */
  periodEnd: string & tags.Format<"date-time">;
/** @evidence prisma:tax_returns.status Carries the persisted status value. */
  status: "prepared" | "under_review" | "filed" | "amended";
/** @evidence prisma:tax_returns.total_tax Carries the persisted totalTax value. */
  totalTax: number;
/** @evidence prisma:tax_returns.notes Carries the persisted notes value. */
  notes: null | string;
/** @evidence prisma:tax_returns.original_return_id Carries the persisted originalReturnId value. */
  originalReturnId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:tax_returns.version Carries the persisted version value. */
  version: number;
/** @evidence prisma:tax_returns.filed_at Carries the persisted filedAt value. */
  filedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:tax_returns.created_by_user_id Carries the persisted createdByUserId value. */
  createdByUserId: string & tags.Format<"uuid">;
/** @evidence prisma:tax_returns.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:tax_returns.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ITaxReturn {
  export interface ICreate { jurisdictionId: string & tags.Format<"uuid">; periodStart: string & tags.Format<"date-time">; periodEnd: string & tags.Format<"date-time">; totalTax: number; notes?: null | string; }
  export interface IRequest extends IPage.IRequest { jurisdictionId?: string; status?: ITaxReturn["status"]; }
  export interface IStatus { status: "under_review" | "filed"; }
  export interface IVersion { totalTax: number; notes?: null | string; }
}
