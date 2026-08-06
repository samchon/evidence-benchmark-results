import type { tags } from "typia";
import type { IPage } from "../typings";
/** Bank reconciliation statement period. */
/**
 * @evidence prisma:reconciliations Exposes the persisted reconciliations record.
 */
export interface IReconciliation {
  /** @evidence prisma:reconciliations.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:reconciliations.bank_account_id Carries the persisted bankAccountId value. */
  bankAccountId: string & tags.Format<"uuid">;
  /** @evidence prisma:reconciliations.period_start Carries the persisted periodStart value. */
  periodStart: string & tags.Format<"date-time">;
  /** @evidence prisma:reconciliations.period_end Carries the persisted periodEnd value. */
  periodEnd: string & tags.Format<"date-time">;
  /** @evidence prisma:reconciliations.beginning_balance Carries the persisted beginningBalance value. */
  beginningBalance: number;
  /** @evidence prisma:reconciliations.ending_balance Carries the persisted endingBalance value. */
  endingBalance: number;
  /** @evidence prisma:reconciliations.status Carries the persisted status value. */
  status: "in_progress" | "completed" | "reopened";
  /** @evidence prisma:reconciliations.operator_user_id Carries the persisted operatorUserId value. */
  operatorUserId: string & tags.Format<"uuid">;
  /** @evidence prisma:reconciliations.completed_at Carries the persisted completedAt value. */
  completedAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:reconciliations.reopened_at Carries the persisted reopenedAt value. */
  reopenedAt: null | (string & tags.Format<"date-time">);
  lineIds: string[];
  /** @evidence prisma:reconciliations.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:reconciliations.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IReconciliation { export interface ICreate { bankAccountId: string & tags.Format<"uuid">; periodStart: string & tags.Format<"date-time">; periodEnd: string & tags.Format<"date-time">; beginningBalance: number; endingBalance: number; } export interface ILine { bankTransactionId: string & tags.Format<"uuid">; included?: boolean; } export interface IRequest extends IPage.IRequest { bankAccountId?: string; status?: IReconciliation["status"]; } }
