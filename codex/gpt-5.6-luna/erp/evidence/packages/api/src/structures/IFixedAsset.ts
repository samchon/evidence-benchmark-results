import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * FixedAsset public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-fixed-asset-fixed-asset-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-fixed-asset-fixed-asset-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:fixed_assets Represents the persisted fixed_assets model.
 * @evidenceReview prisma:fixed_assets Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IFixedAsset extends IErpRecord {
  /** id.
   * @evidence prisma:fixed_assets.id Carries the persisted id value.
   * @evidenceReview prisma:fixed_assets.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:fixed_assets.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:fixed_assets.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:fixed_assets.name Carries the persisted name value.
   * @evidenceReview prisma:fixed_assets.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:fixed_assets.status Carries the persisted status value.
   * @evidenceReview prisma:fixed_assets.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:fixed_assets.description Carries the persisted description value.
   * @evidenceReview prisma:fixed_assets.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:fixed_assets.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:fixed_assets.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:fixed_assets.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:fixed_assets.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:fixed_assets.amount Carries the persisted amount value.
   * @evidenceReview prisma:fixed_assets.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:fixed_assets.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:fixed_assets.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:fixed_assets.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:fixed_assets.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:fixed_assets.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:fixed_assets.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:fixed_assets.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:fixed_assets.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
