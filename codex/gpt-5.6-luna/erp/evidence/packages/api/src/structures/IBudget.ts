import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:budgets Exposes the persisted budgets record.
 */
export interface IBudget {
  /** @evidence prisma:budgets.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:budgets.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:budgets.fiscal_year Carries the persisted fiscalYear value. */
  fiscalYear: number;
  /** @evidence prisma:budgets.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:budgets.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
/** @evidence prisma:budgets.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
/** @evidence prisma:budgets.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:budgets.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IBudget { export interface ICreate { name: string; fiscalYear: number; currencyCode: string; totalAmount?: number; } export interface IRequest extends IPage.IRequest { status?: string; fiscalYear?: number; } export interface IStatus { status: "draft" | "submitted" | "approved" | "rejected" | "archived"; } }
