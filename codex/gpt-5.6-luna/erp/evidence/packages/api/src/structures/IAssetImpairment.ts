import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * AssetImpairment public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-asset-impairment-asset-impairments Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-asset-impairment-asset-impairments Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:asset_impairments Represents the persisted asset_impairments model.
 * @evidenceReview prisma:asset_impairments Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IAssetImpairment extends IErpRecord {
  /** id.
   * @evidence prisma:asset_impairments.id Carries the persisted id value.
   * @evidenceReview prisma:asset_impairments.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:asset_impairments.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:asset_impairments.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:asset_impairments.name Carries the persisted name value.
   * @evidenceReview prisma:asset_impairments.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:asset_impairments.status Carries the persisted status value.
   * @evidenceReview prisma:asset_impairments.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:asset_impairments.description Carries the persisted description value.
   * @evidenceReview prisma:asset_impairments.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:asset_impairments.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:asset_impairments.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:asset_impairments.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:asset_impairments.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:asset_impairments.amount Carries the persisted amount value.
   * @evidenceReview prisma:asset_impairments.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:asset_impairments.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:asset_impairments.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:asset_impairments.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:asset_impairments.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:asset_impairments.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:asset_impairments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:asset_impairments.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:asset_impairments.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
