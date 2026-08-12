import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Vendor public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-vendor-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vendor-vendor-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:vendors Represents the persisted vendors model.
 * @evidenceReview prisma:vendors Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IVendor extends IErpRecord {
  /** id.
   * @evidence prisma:vendors.id Carries the persisted id value.
   * @evidenceReview prisma:vendors.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:vendors.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:vendors.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:vendors.name Carries the persisted name value.
   * @evidenceReview prisma:vendors.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:vendors.status Carries the persisted status value.
   * @evidenceReview prisma:vendors.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:vendors.description Carries the persisted description value.
   * @evidenceReview prisma:vendors.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:vendors.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:vendors.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:vendors.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:vendors.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:vendors.amount Carries the persisted amount value.
   * @evidenceReview prisma:vendors.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:vendors.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:vendors.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:vendors.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:vendors.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:vendors.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:vendors.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:vendors.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:vendors.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
