import type { tags } from "typia";
import type { IPage } from "../typings";
/** Tax treatment code within a jurisdiction. */
/**
 * @evidence prisma:tax_codes Exposes the persisted tax_codes record.
 */
export interface ITaxCode {
  /** @evidence prisma:tax_codes.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:tax_codes.jurisdiction_id Carries the persisted jurisdictionId value. */
  jurisdictionId: string & tags.Format<"uuid">;
/** @evidence prisma:tax_codes.tax_type Carries the persisted taxType value. */
  taxType: string;
  /** @evidence prisma:tax_codes.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:tax_codes.payable_account_id Carries the persisted payableAccountId value. */
  payableAccountId: null | string;
/** @evidence prisma:tax_codes.receivable_account_id Carries the persisted receivableAccountId value. */
  receivableAccountId: null | string;
  /** @evidence prisma:tax_codes.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:tax_codes.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:tax_codes.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ITaxCode { export interface ICreate { jurisdictionId: string & tags.Format<"uuid">; taxType: string & tags.MinLength<1>; name: string & tags.MinLength<1>; payableAccountId?: null | string; receivableAccountId?: null | string; } export interface IUpdate { taxType?: string; name?: string; payableAccountId?: null | string; receivableAccountId?: null | string; } export interface IRequest extends IPage.IRequest { jurisdictionId?: string; search?: string; includeInactive?: boolean; } }
