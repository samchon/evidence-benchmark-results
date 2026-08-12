import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * VendorPayment public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-payment-vendor-payments Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vendor-payment-vendor-payments Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:vendor_payments Represents the persisted vendor_payments model.
 * @evidenceReview prisma:vendor_payments Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IVendorPayment extends IErpRecord {
  /** id.
   * @evidence prisma:vendor_payments.id Carries the persisted id value.
   * @evidenceReview prisma:vendor_payments.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:vendor_payments.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:vendor_payments.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:vendor_payments.name Carries the persisted name value.
   * @evidenceReview prisma:vendor_payments.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:vendor_payments.status Carries the persisted status value.
   * @evidenceReview prisma:vendor_payments.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:vendor_payments.description Carries the persisted description value.
   * @evidenceReview prisma:vendor_payments.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:vendor_payments.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:vendor_payments.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:vendor_payments.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:vendor_payments.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:vendor_payments.amount Carries the persisted amount value.
   * @evidenceReview prisma:vendor_payments.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:vendor_payments.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:vendor_payments.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:vendor_payments.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:vendor_payments.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:vendor_payments.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:vendor_payments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:vendor_payments.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:vendor_payments.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
