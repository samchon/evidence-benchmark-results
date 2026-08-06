import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:budget_lines Exposes the persisted budget_lines record.
 */
export interface IBudgetLine {
  /** @evidence prisma:budget_lines.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:budget_lines.budget_id Carries the persisted budgetId value. */
  budgetId: string & tags.Format<"uuid">;
/** @evidence prisma:budget_lines.account_id Carries the persisted accountId value. */
  accountId: null | string;
/** @evidence prisma:budget_lines.cost_center_id Carries the persisted costCenterId value. */
  costCenterId: null | string;
/** @evidence prisma:budget_lines.project_id Carries the persisted projectId value. */
  projectId: null | string;
/** @evidence prisma:budget_lines.period_start Carries the persisted periodStart value. */
  periodStart: string & tags.Format<"date-time">;
/** @evidence prisma:budget_lines.period_end Carries the persisted periodEnd value. */
  periodEnd: string & tags.Format<"date-time">;
/** @evidence prisma:budget_lines.amount Carries the persisted amount value. */
  amount: number;
/** @evidence prisma:budget_lines.committed_amount Carries the persisted committedAmount value. */
  committedAmount: number;
/** @evidence prisma:budget_lines.actual_amount Carries the persisted actualAmount value. */
  actualAmount: number;
/** @evidence prisma:budget_lines.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:budget_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IBudgetLine { export interface ICreate { budgetId: string & tags.Format<"uuid">; accountId?: null | string; costCenterId?: null | string; projectId?: null | string; periodStart: string & tags.Format<"date-time">; periodEnd: string & tags.Format<"date-time">; amount: number; } export interface IRequest extends IPage.IRequest { budgetId?: string; costCenterId?: string; } }
