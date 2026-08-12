import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Tag public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-tag-tags Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-tag-tags Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:tags Represents the persisted tags model.
 * @evidenceReview prisma:tags Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ITag extends IErpRecord {
  /** id.
   * @evidence prisma:tags.id Carries the persisted id value.
   * @evidenceReview prisma:tags.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:tags.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:tags.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:tags.name Carries the persisted name value.
   * @evidenceReview prisma:tags.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:tags.status Carries the persisted status value.
   * @evidenceReview prisma:tags.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:tags.description Carries the persisted description value.
   * @evidenceReview prisma:tags.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:tags.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:tags.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:tags.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:tags.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:tags.amount Carries the persisted amount value.
   * @evidenceReview prisma:tags.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:tags.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:tags.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:tags.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:tags.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:tags.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:tags.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:tags.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:tags.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
