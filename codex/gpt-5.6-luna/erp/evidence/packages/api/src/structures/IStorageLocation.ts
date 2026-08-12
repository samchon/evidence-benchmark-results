import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * StorageLocation public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-location-storage-locations Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-location-storage-locations Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:storage_locations Represents the persisted storage_locations model.
 * @evidenceReview prisma:storage_locations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IStorageLocation extends IErpRecord {
  /** id.
   * @evidence prisma:storage_locations.id Carries the persisted id value.
   * @evidenceReview prisma:storage_locations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:storage_locations.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:storage_locations.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:storage_locations.name Carries the persisted name value.
   * @evidenceReview prisma:storage_locations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:storage_locations.status Carries the persisted status value.
   * @evidenceReview prisma:storage_locations.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:storage_locations.description Carries the persisted description value.
   * @evidenceReview prisma:storage_locations.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:storage_locations.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:storage_locations.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:storage_locations.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:storage_locations.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:storage_locations.amount Carries the persisted amount value.
   * @evidenceReview prisma:storage_locations.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:storage_locations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:storage_locations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:storage_locations.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:storage_locations.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:storage_locations.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:storage_locations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:storage_locations.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:storage_locations.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
