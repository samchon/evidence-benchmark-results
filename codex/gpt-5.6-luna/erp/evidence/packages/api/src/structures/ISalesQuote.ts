import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * SalesQuote public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-sales-quote-sales-quote-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-sales-quote-sales-quote-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:sales_quotes Represents the persisted sales_quotes model.
 * @evidenceReview prisma:sales_quotes Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ISalesQuote extends IErpRecord {
  /** id.
   * @evidence prisma:sales_quotes.id Carries the persisted id value.
   * @evidenceReview prisma:sales_quotes.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:sales_quotes.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:sales_quotes.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:sales_quotes.name Carries the persisted name value.
   * @evidenceReview prisma:sales_quotes.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:sales_quotes.status Carries the persisted status value.
   * @evidenceReview prisma:sales_quotes.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:sales_quotes.description Carries the persisted description value.
   * @evidenceReview prisma:sales_quotes.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:sales_quotes.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:sales_quotes.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:sales_quotes.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:sales_quotes.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:sales_quotes.amount Carries the persisted amount value.
   * @evidenceReview prisma:sales_quotes.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:sales_quotes.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:sales_quotes.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:sales_quotes.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:sales_quotes.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:sales_quotes.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:sales_quotes.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:sales_quotes.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:sales_quotes.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
