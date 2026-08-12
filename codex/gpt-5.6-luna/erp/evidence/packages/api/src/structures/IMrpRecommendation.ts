import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * MrpRecommendation public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-mrp-recommendation-mrp-recommendations Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-mrp-recommendation-mrp-recommendations Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:mrp_recommendations Represents the persisted mrp_recommendations model.
 * @evidenceReview prisma:mrp_recommendations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IMrpRecommendation extends IErpRecord {
  /** id.
   * @evidence prisma:mrp_recommendations.id Carries the persisted id value.
   * @evidenceReview prisma:mrp_recommendations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:mrp_recommendations.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:mrp_recommendations.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:mrp_recommendations.name Carries the persisted name value.
   * @evidenceReview prisma:mrp_recommendations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:mrp_recommendations.status Carries the persisted status value.
   * @evidenceReview prisma:mrp_recommendations.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:mrp_recommendations.description Carries the persisted description value.
   * @evidenceReview prisma:mrp_recommendations.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:mrp_recommendations.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:mrp_recommendations.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:mrp_recommendations.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:mrp_recommendations.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:mrp_recommendations.amount Carries the persisted amount value.
   * @evidenceReview prisma:mrp_recommendations.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:mrp_recommendations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:mrp_recommendations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:mrp_recommendations.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:mrp_recommendations.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:mrp_recommendations.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:mrp_recommendations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:mrp_recommendations.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:mrp_recommendations.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
