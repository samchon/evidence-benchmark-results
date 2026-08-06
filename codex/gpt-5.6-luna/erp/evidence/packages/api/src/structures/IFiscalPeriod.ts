import type { tags } from "typia";
/** One fiscal posting period. */
/**
 * @evidence prisma:fiscal_periods Exposes the persisted fiscal_periods record.
 */
export interface IFiscalPeriod {
  /** @evidence prisma:fiscal_periods.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:fiscal_periods.ordinal Carries the persisted ordinal value. */
  ordinal: number;
  /** @evidence prisma:fiscal_periods.starts_at Carries the persisted startsAt value. */
  startsAt: string & tags.Format<"date-time">;
  /** @evidence prisma:fiscal_periods.ends_at Carries the persisted endsAt value. */
  endsAt: string & tags.Format<"date-time">;
  /** @evidence prisma:fiscal_periods.status Carries the persisted status value. */
  status: "open" | "soft_closed" | "hard_closed" | "reopened";
}
