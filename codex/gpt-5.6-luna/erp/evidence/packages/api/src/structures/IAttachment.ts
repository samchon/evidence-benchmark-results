import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Attachment public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-attachment-attachments Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-attachment-attachments Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:attachments Represents the persisted attachments model.
 * @evidenceReview prisma:attachments Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IAttachment extends IErpRecord {
  /** id.
   * @evidence prisma:attachments.id Carries the persisted id value.
   * @evidenceReview prisma:attachments.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:attachments.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:attachments.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:attachments.name Carries the persisted name value.
   * @evidenceReview prisma:attachments.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:attachments.status Carries the persisted status value.
   * @evidenceReview prisma:attachments.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:attachments.description Carries the persisted description value.
   * @evidenceReview prisma:attachments.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:attachments.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:attachments.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:attachments.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:attachments.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:attachments.amount Carries the persisted amount value.
   * @evidenceReview prisma:attachments.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:attachments.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:attachments.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:attachments.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:attachments.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:attachments.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:attachments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:attachments.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:attachments.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
