import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:mrp_recommendations Exposes the persisted mrp_recommendations record.
 */
export interface IMrpRecommendation {
  /** @evidence prisma:mrp_recommendations.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:mrp_recommendations.mrp_run_id Carries the persisted mrpRunId value. */
  mrpRunId: string & tags.Format<"uuid">;
  /** @evidence prisma:mrp_recommendations.item_id Carries the persisted itemId value. */
  itemId: string & tags.Format<"uuid">;
  /** @evidence prisma:mrp_recommendations.recommendation_type Carries the persisted recommendationType value. */
  recommendationType: string;
  /** @evidence prisma:mrp_recommendations.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:mrp_recommendations.needed_by Carries the persisted neededBy value. */
  neededBy: string & tags.Format<"date-time">;
  /** @evidence prisma:mrp_recommendations.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:mrp_recommendations.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:mrp_recommendations.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IMrpRecommendation { export interface ICreate { mrpRunId: string & tags.Format<"uuid">; itemId: string & tags.Format<"uuid">; recommendationType: string; quantity: number; neededBy: string & tags.Format<"date-time">; } export interface IRequest extends IPage.IRequest { mrpRunId?: string; itemId?: string; status?: string; } export interface IStatus { status: "proposed" | "accepted" | "rejected" | "converted"; } }
