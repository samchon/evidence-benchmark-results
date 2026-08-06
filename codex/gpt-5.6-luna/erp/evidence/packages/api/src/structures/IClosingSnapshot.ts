import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:closing_snapshots Exposes the persisted closing_snapshots record.
 */
export interface IClosingSnapshot {
  /** @evidence prisma:closing_snapshots.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:closing_snapshots.fiscal_period_id Carries the persisted fiscalPeriodId value. */
  fiscalPeriodId: string & tags.Format<"uuid">;
  /** @evidence prisma:closing_snapshots.kind Carries the persisted kind value. */
  kind: string;
  /** @evidence prisma:closing_snapshots.payload Carries the persisted payload value. */
  payload: string;
  /** @evidence prisma:closing_snapshots.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IClosingSnapshot { export interface ICreate { fiscalPeriodId: string & tags.Format<"uuid">; kind: string; payload: string; } export interface IRequest extends IPage.IRequest { fiscalPeriodId?: string; kind?: string; } }
