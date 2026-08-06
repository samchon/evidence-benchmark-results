import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization ledger account. */
/**
 * @evidence prisma:accounts Represents persisted ledger accounts.
 */
export interface IAccount {
  /** @evidence prisma:accounts.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:accounts.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:accounts.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:accounts.account_type Carries the persisted accountType value. */
  accountType: "asset" | "liability" | "equity" | "revenue" | "expense";
/** @evidence prisma:accounts.parent_id Carries the persisted parentId value. */
  parentId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:accounts.currency_id Carries the persisted currencyId value. */
  currencyId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:accounts.description Carries the persisted description value. */
  description: null | string;
  /** @evidence prisma:accounts.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:accounts.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:accounts.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IAccount { export interface ICreate { code: string & tags.MinLength<1>; name: string & tags.MinLength<1>; accountType: IAccount["accountType"]; parentId?: null | string; currencyId?: null | string; description?: null | string; } export interface IUpdate { name?: string; parentId?: null | string; currencyId?: null | string; description?: null | string; } export interface IRequest extends IPage.IRequest { search?: string; accountType?: IAccount["accountType"]; parentId?: string; includeInactive?: boolean; } }
