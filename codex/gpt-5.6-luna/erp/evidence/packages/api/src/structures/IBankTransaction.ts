import type { tags } from "typia";
import type { IPage } from "../typings";
/** Bank statement transaction. */
/**
 * @evidence prisma:bank_transactions Exposes the persisted bank_transactions record.
 */
export interface IBankTransaction {
  /** @evidence prisma:bank_transactions.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:bank_transactions.bank_account_id Carries the persisted bankAccountId value. */
  bankAccountId: string & tags.Format<"uuid">;
  /** @evidence prisma:bank_transactions.statement_date Carries the persisted statementDate value. */
  statementDate: string & tags.Format<"date-time">;
  /** @evidence prisma:bank_transactions.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:bank_transactions.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
  /** @evidence prisma:bank_transactions.description Carries the persisted description value. */
  description: string;
  /** @evidence prisma:bank_transactions.reference Carries the persisted reference value. */
  reference: null | string;
  /** @evidence prisma:bank_transactions.origin Carries the persisted origin value. */
  origin: string;
  /** @evidence prisma:bank_transactions.status Carries the persisted status value. */
  status: "imported" | "matched" | "ignored" | "reconciled";
  /** @evidence prisma:bank_transactions.match_type Carries the persisted matchType value. */
  matchType: null | string;
  /** @evidence prisma:bank_transactions.match_id Carries the persisted matchId value. */
  matchId: null | string;
  /** @evidence prisma:bank_transactions.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:bank_transactions.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IBankTransaction { export interface ICreate { bankAccountId: string & tags.Format<"uuid">; statementDate: string & tags.Format<"date-time">; amount: number; currencyCode: string; description: string & tags.MinLength<1>; reference?: null | string; origin?: string; } export interface IRequest extends IPage.IRequest { bankAccountId?: string; status?: IBankTransaction["status"]; search?: string; } export interface IMatch { matchType: string; matchId: string & tags.Format<"uuid">; } }
