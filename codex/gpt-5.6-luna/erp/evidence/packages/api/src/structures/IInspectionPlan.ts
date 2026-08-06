import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:inspection_plans Exposes the persisted inspection_plans record.
 */
export interface IInspectionPlan {
  /** @evidence prisma:inspection_plans.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:inspection_plans.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:inspection_plans.item_id Carries the persisted itemId value. */
  itemId: null | string;
  /** @evidence prisma:inspection_plans.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:inspection_plans.sampling_method Carries the persisted samplingMethod value. */
  samplingMethod: string;
  /** @evidence prisma:inspection_plans.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:inspection_plans.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IInspectionPlan { export interface ICreate { name: string; itemId?: null | string; samplingMethod: string; } export interface IRequest extends IPage.IRequest { status?: string; itemId?: string; } export interface IStatus { status: "draft" | "active" | "inactive"; } }
