import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * BomVersion public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-bom-bill-of-materials-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-bom-bill-of-materials-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:bom_versions Represents the persisted bom_versions model.
 * @evidenceReview prisma:bom_versions Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IBomVersion extends IErpRecord {
  /** id.
   * @evidence prisma:bom_versions.id Carries the persisted id value.
   * @evidenceReview prisma:bom_versions.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:bom_versions.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:bom_versions.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:bom_versions.name Carries the persisted name value.
   * @evidenceReview prisma:bom_versions.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:bom_versions.status Carries the persisted status value.
   * @evidenceReview prisma:bom_versions.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:bom_versions.description Carries the persisted description value.
   * @evidenceReview prisma:bom_versions.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:bom_versions.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:bom_versions.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:bom_versions.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:bom_versions.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:bom_versions.amount Carries the persisted amount value.
   * @evidenceReview prisma:bom_versions.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:bom_versions.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:bom_versions.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:bom_versions.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:bom_versions.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:bom_versions.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:bom_versions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:bom_versions.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:bom_versions.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
