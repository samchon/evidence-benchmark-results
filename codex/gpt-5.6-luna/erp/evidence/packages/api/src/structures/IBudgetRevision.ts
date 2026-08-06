import type { tags } from "typia";
/** Corrective version of an approved budget. */
/**
 * @evidence prisma:budget_revisions Exposes the persisted budget_revisions record.
 */
export interface IBudgetRevision {
  /** @evidence prisma:budget_revisions.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:budget_revisions.budget_id Carries the persisted budgetId value. */
  budgetId: string & tags.Format<"uuid">;
  /** @evidence prisma:budget_revisions.revision_number Carries the persisted revisionNumber value. */
  revisionNumber: number;
  /** @evidence prisma:budget_revisions.reason Carries the persisted reason value. */
  reason: string;
  /** @evidence prisma:budget_revisions.status Carries the persisted status value. */
  status: "draft" | "submitted" | "approved" | "rejected";
  /** @evidence prisma:budget_revisions.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
  /** @evidence prisma:budget_revisions.created_by_user_id Carries the persisted createdByUserId value. */
  createdByUserId: string & tags.Format<"uuid">;
  /** @evidence prisma:budget_revisions.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:budget_revisions.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IBudgetRevision { export interface ICreate { budgetId: string & tags.Format<"uuid">; reason: string & tags.MinLength<1>; totalAmount: number; } export interface IStatus { status: "submitted" | "approved" | "rejected"; } }
