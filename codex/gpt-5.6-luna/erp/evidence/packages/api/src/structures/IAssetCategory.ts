import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * AssetCategory public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-asset-category-asset-categories Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-asset-category-asset-categories Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:asset_categories Represents the persisted asset_categories model.
 * @evidenceReview prisma:asset_categories Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IAssetCategory extends IErpRecord {
  /** id.
   * @evidence prisma:asset_categories.id Carries the persisted id value.
   * @evidenceReview prisma:asset_categories.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:asset_categories.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:asset_categories.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:asset_categories.name Carries the persisted name value.
   * @evidenceReview prisma:asset_categories.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:asset_categories.status Carries the persisted status value.
   * @evidenceReview prisma:asset_categories.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:asset_categories.description Carries the persisted description value.
   * @evidenceReview prisma:asset_categories.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:asset_categories.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:asset_categories.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:asset_categories.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:asset_categories.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:asset_categories.amount Carries the persisted amount value.
   * @evidenceReview prisma:asset_categories.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:asset_categories.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:asset_categories.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:asset_categories.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:asset_categories.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:asset_categories.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:asset_categories.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:asset_categories.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:asset_categories.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
