import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * PaymentTerm public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-payment-term-payment-terms Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-payment-term-payment-terms Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:payment_terms Represents the persisted payment_terms model.
 * @evidenceReview prisma:payment_terms Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IPaymentTerm extends IErpRecord {
  /** id.
   * @evidence prisma:payment_terms.id Carries the persisted id value.
   * @evidenceReview prisma:payment_terms.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:payment_terms.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:payment_terms.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:payment_terms.name Carries the persisted name value.
   * @evidenceReview prisma:payment_terms.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:payment_terms.status Carries the persisted status value.
   * @evidenceReview prisma:payment_terms.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:payment_terms.description Carries the persisted description value.
   * @evidenceReview prisma:payment_terms.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:payment_terms.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:payment_terms.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:payment_terms.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:payment_terms.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:payment_terms.amount Carries the persisted amount value.
   * @evidenceReview prisma:payment_terms.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:payment_terms.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:payment_terms.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:payment_terms.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:payment_terms.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:payment_terms.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:payment_terms.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:payment_terms.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:payment_terms.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
