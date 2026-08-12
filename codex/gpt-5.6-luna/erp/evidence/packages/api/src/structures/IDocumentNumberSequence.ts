import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * DocumentNumberSequence public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-doc-number-document-number-sequences Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-doc-number-document-number-sequences Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:document_number_sequences Represents the persisted document_number_sequences model.
 * @evidenceReview prisma:document_number_sequences Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IDocumentNumberSequence extends IErpRecord {
  /** id.
   * @evidence prisma:document_number_sequences.id Carries the persisted id value.
   * @evidenceReview prisma:document_number_sequences.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:document_number_sequences.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:document_number_sequences.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:document_number_sequences.name Carries the persisted name value.
   * @evidenceReview prisma:document_number_sequences.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:document_number_sequences.status Carries the persisted status value.
   * @evidenceReview prisma:document_number_sequences.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:document_number_sequences.description Carries the persisted description value.
   * @evidenceReview prisma:document_number_sequences.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:document_number_sequences.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:document_number_sequences.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:document_number_sequences.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:document_number_sequences.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:document_number_sequences.amount Carries the persisted amount value.
   * @evidenceReview prisma:document_number_sequences.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:document_number_sequences.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:document_number_sequences.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:document_number_sequences.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:document_number_sequences.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:document_number_sequences.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:document_number_sequences.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:document_number_sequences.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:document_number_sequences.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
