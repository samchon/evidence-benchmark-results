import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * CycleCount public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-cycle-count-cycle-count-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-cycle-count-cycle-count-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:cycle_counts Represents the persisted cycle_counts model.
 * @evidenceReview prisma:cycle_counts Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ICycleCount extends IErpRecord {
  /** id.
   * @evidence prisma:cycle_counts.id Carries the persisted id value.
   * @evidenceReview prisma:cycle_counts.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:cycle_counts.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:cycle_counts.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:cycle_counts.name Carries the persisted name value.
   * @evidenceReview prisma:cycle_counts.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:cycle_counts.status Carries the persisted status value.
   * @evidenceReview prisma:cycle_counts.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:cycle_counts.description Carries the persisted description value.
   * @evidenceReview prisma:cycle_counts.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:cycle_counts.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:cycle_counts.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:cycle_counts.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:cycle_counts.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:cycle_counts.amount Carries the persisted amount value.
   * @evidenceReview prisma:cycle_counts.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:cycle_counts.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:cycle_counts.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:cycle_counts.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:cycle_counts.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:cycle_counts.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:cycle_counts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:cycle_counts.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:cycle_counts.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
