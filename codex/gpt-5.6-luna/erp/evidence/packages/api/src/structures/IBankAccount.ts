import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization bank account. */
/**
 * @evidence prisma:bank_accounts Exposes the persisted bank_accounts record.
 */
export interface IBankAccount {
  /** @evidence prisma:bank_accounts.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:bank_accounts.institution_name Carries the persisted institutionName value. */
  institutionName: string;
/** @evidence prisma:bank_accounts.account_reference Carries the persisted accountReference value. */
  accountReference: string;
/** @evidence prisma:bank_accounts.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
/** @evidence prisma:bank_accounts.opening_balance Carries the persisted openingBalance value. */
  openingBalance: number;
/** @evidence prisma:bank_accounts.ledger_account_id Carries the persisted ledgerAccountId value. */
  ledgerAccountId: string & tags.Format<"uuid">;
/** @evidence prisma:bank_accounts.reconciliation_state Carries the persisted reconciliationState value. */
  reconciliationState: string;
/** @evidence prisma:bank_accounts.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:bank_accounts.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:bank_accounts.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IBankAccount { export interface ICreate { institutionName: string & tags.MinLength<1>; accountReference: string & tags.MinLength<1>; currencyCode: string & tags.MinLength<3>; openingBalance: number; ledgerAccountId: string & tags.Format<"uuid">; } export interface IUpdate { institutionName?: string; openingBalance?: number; ledgerAccountId?: string; } export interface IRequest extends IPage.IRequest { search?: string; includeInactive?: boolean; } }
