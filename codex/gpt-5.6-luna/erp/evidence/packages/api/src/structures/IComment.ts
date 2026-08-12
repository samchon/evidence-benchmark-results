import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Comment public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comments Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-comments Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:comments Represents the persisted comments model.
 * @evidenceReview prisma:comments Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IComment extends IErpRecord {
  /** id.
   * @evidence prisma:comments.id Carries the persisted id value.
   * @evidenceReview prisma:comments.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:comments.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:comments.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:comments.name Carries the persisted name value.
   * @evidenceReview prisma:comments.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:comments.status Carries the persisted status value.
   * @evidenceReview prisma:comments.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:comments.description Carries the persisted description value.
   * @evidenceReview prisma:comments.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:comments.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:comments.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:comments.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:comments.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:comments.amount Carries the persisted amount value.
   * @evidenceReview prisma:comments.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:comments.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:comments.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:comments.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:comments.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:comments.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:comments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:comments.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:comments.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
