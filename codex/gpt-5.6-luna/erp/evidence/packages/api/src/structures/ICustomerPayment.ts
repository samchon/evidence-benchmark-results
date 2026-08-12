import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * CustomerPayment public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-customer-payment-customer-payments Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-customer-payment-customer-payments Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:customer_payments Represents the persisted customer_payments model.
 * @evidenceReview prisma:customer_payments Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ICustomerPayment extends IErpRecord {
  /** id.
   * @evidence prisma:customer_payments.id Carries the persisted id value.
   * @evidenceReview prisma:customer_payments.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:customer_payments.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:customer_payments.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:customer_payments.name Carries the persisted name value.
   * @evidenceReview prisma:customer_payments.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:customer_payments.status Carries the persisted status value.
   * @evidenceReview prisma:customer_payments.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:customer_payments.description Carries the persisted description value.
   * @evidenceReview prisma:customer_payments.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:customer_payments.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:customer_payments.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:customer_payments.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:customer_payments.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:customer_payments.amount Carries the persisted amount value.
   * @evidenceReview prisma:customer_payments.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:customer_payments.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:customer_payments.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:customer_payments.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:customer_payments.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:customer_payments.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:customer_payments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:customer_payments.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:customer_payments.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
