import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:allocation_rules Exposes the persisted allocation_rules record.
 */
export interface IAllocationRule {
  /** @evidence prisma:allocation_rules.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:allocation_rules.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:allocation_rules.source_type Carries the persisted sourceType value. */
  sourceType: string;
  /** @evidence prisma:allocation_rules.target_type Carries the persisted targetType value. */
  targetType: string;
  /** @evidence prisma:allocation_rules.basis Carries the persisted basis value. */
  basis: string;
  /** @evidence prisma:allocation_rules.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:allocation_rules.percentage Carries the persisted percentage value. */
  percentage: number;
  /** @evidence prisma:allocation_rules.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:allocation_rules.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IAllocationRule { export interface ICreate { name: string; sourceType: string; targetType: string; basis: string; percentage: number; } export interface IRequest extends IPage.IRequest { sourceType?: string; targetType?: string; basis?: string; status?: string; } export interface IStatus { status: "draft" | "active" | "inactive"; } export interface IExecute { inputAmount: number; } export interface IPost { journalEntryId?: null | string; } }
