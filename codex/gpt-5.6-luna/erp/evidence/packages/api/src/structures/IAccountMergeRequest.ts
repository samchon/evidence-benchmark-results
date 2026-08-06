import type { tags } from "typia";
import type { IPage } from "../typings";

/** Approval workflow for preserving posted history while merging two ledger accounts. */
/**
 * @evidence prisma:account_merge_requests Exposes the persisted account_merge_requests record.
 */
export interface IAccountMergeRequest {
/** @evidence prisma:account_merge_requests.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:account_merge_requests.source_account_id Carries the persisted sourceAccountId value. */
  sourceAccountId: string & tags.Format<"uuid">;
/** @evidence prisma:account_merge_requests.target_account_id Carries the persisted targetAccountId value. */
  targetAccountId: string & tags.Format<"uuid">;
/** @evidence prisma:account_merge_requests.reason Carries the persisted reason value. */
  reason: string;
/** @evidence prisma:account_merge_requests.status Carries the persisted status value. */
  status: "pending" | "approved" | "rejected" | "applied";
/** @evidence prisma:account_merge_requests.requested_by_user_id Carries the persisted requestedByUserId value. */
  requestedByUserId: string & tags.Format<"uuid">;
/** @evidence prisma:account_merge_requests.decided_by_user_id Carries the persisted decidedByUserId value. */
  decidedByUserId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:account_merge_requests.applied_at Carries the persisted appliedAt value. */
  appliedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:account_merge_requests.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:account_merge_requests.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IAccountMergeRequest {
  export interface ICreate { sourceAccountId: string & tags.Format<"uuid">; targetAccountId: string & tags.Format<"uuid">; reason: string & tags.MinLength<1>; }
  export interface IRequest extends IPage.IRequest { status?: IAccountMergeRequest["status"]; sourceAccountId?: string; targetAccountId?: string; }
  export interface IStatus { status: "approved" | "rejected"; }
}
