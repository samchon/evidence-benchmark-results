import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * JournalEntry public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-journal-journal-entry-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-journal-journal-entry-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:journal_entries Represents the persisted journal_entries model.
 * @evidenceReview prisma:journal_entries Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IJournalEntry extends IErpRecord {
  /** id.
   * @evidence prisma:journal_entries.id Carries the persisted id value.
   * @evidenceReview prisma:journal_entries.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:journal_entries.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:journal_entries.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:journal_entries.name Carries the persisted name value.
   * @evidenceReview prisma:journal_entries.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:journal_entries.status Carries the persisted status value.
   * @evidenceReview prisma:journal_entries.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:journal_entries.description Carries the persisted description value.
   * @evidenceReview prisma:journal_entries.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:journal_entries.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:journal_entries.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:journal_entries.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:journal_entries.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:journal_entries.amount Carries the persisted amount value.
   * @evidenceReview prisma:journal_entries.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:journal_entries.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:journal_entries.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:journal_entries.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:journal_entries.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:journal_entries.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:journal_entries.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:journal_entries.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:journal_entries.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
