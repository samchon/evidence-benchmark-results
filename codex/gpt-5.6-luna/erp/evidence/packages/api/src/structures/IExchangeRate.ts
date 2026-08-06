import type { tags } from "typia";
import type { IPage } from "../typings";

/** Effective-dated conversion rate for an organization currency pair. */
/**
 * @evidence prisma:exchange_rates Exposes the persisted exchange_rates record.
 */
export interface IExchangeRate {
/** @evidence prisma:exchange_rates.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  sourceCode: string;
  targetCode: string;
/** @evidence prisma:exchange_rates.effective_at Carries the persisted effectiveAt value. */
  effectiveAt: string & tags.Format<"date-time">;
/** @evidence prisma:exchange_rates.rate Carries the persisted rate value. */
  rate: number;
/** @evidence prisma:exchange_rates.origin Carries the persisted origin value. */
  origin: string;
/** @evidence prisma:exchange_rates.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IExchangeRate {
  export interface ICreate { sourceCode: string & tags.MinLength<3>; targetCode: string & tags.MinLength<3>; effectiveAt: string & tags.Format<"date-time">; rate: number; origin?: string; }
  export interface IRequest extends IPage.IRequest { sourceCode?: string; targetCode?: string; }
  export interface IResolve { sourceCode: string; targetCode: string; at: string & tags.Format<"date-time">; }
  export interface IRefresh { rates: ICreate[] & tags.MinItems<1>; }
}
