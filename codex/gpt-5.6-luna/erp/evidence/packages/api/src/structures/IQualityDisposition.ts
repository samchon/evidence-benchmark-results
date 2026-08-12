import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * QualityDisposition public representation.
 * @evidence prisma:quality_dispositions Represents the persisted quality_dispositions model.
 * @evidenceReview prisma:quality_dispositions Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IQualityDisposition extends IErpRecord {
  /** id.
   * @evidence prisma:quality_dispositions.id Carries the persisted id value.
   * @evidenceReview prisma:quality_dispositions.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:quality_dispositions.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:quality_dispositions.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:quality_dispositions.name Carries the persisted name value.
   * @evidenceReview prisma:quality_dispositions.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:quality_dispositions.status Carries the persisted status value.
   * @evidenceReview prisma:quality_dispositions.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:quality_dispositions.description Carries the persisted description value.
   * @evidenceReview prisma:quality_dispositions.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:quality_dispositions.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:quality_dispositions.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:quality_dispositions.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:quality_dispositions.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:quality_dispositions.amount Carries the persisted amount value.
   * @evidenceReview prisma:quality_dispositions.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:quality_dispositions.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:quality_dispositions.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:quality_dispositions.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:quality_dispositions.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:quality_dispositions.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:quality_dispositions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:quality_dispositions.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:quality_dispositions.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
