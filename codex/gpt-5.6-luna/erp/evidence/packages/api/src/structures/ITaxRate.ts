import type { tags } from "typia";
import type { IPage } from "../typings";
/** Effective-dated percentage rate for a tax code. */
/** Effective-dated tax rate.
 */
/**
 * @evidence prisma:tax_rates Exposes the persisted tax_rates record.
 */
export interface ITaxRate {
  /** @evidence prisma:tax_rates.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:tax_rates.tax_code_id Carries the persisted taxCodeId value. */
  taxCodeId: string & tags.Format<"uuid">;
/** @evidence prisma:tax_rates.valid_from Carries the persisted validFrom value. */
  validFrom: string & tags.Format<"date-time">;
/** @evidence prisma:tax_rates.valid_to Carries the persisted validTo value. */
  validTo: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:tax_rates.rate Carries the persisted rate value. */
  rate: number;
/** @evidence prisma:tax_rates.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace ITaxRate { export interface ICreate { taxCodeId: string & tags.Format<"uuid">; validFrom: string & tags.Format<"date-time">; validTo?: null | (string & tags.Format<"date-time">); rate: number; } export interface IRequest extends IPage.IRequest { taxCodeId?: string; } export interface IResolve { taxCodeId: string & tags.Format<"uuid">; at: string & tags.Format<"date-time">; } }
