import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * VendorPaymentAllocation public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-payment-vendor-payments Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vendor-payment-vendor-payments Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:vendor_payment_allocations Represents the persisted vendor_payment_allocations model.
 * @evidenceReview prisma:vendor_payment_allocations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IVendorPaymentAllocation extends IErpRecord {
  /** id.
   * @evidence prisma:vendor_payment_allocations.id Carries the persisted id value.
   * @evidenceReview prisma:vendor_payment_allocations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:vendor_payment_allocations.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:vendor_payment_allocations.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:vendor_payment_allocations.name Carries the persisted name value.
   * @evidenceReview prisma:vendor_payment_allocations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:vendor_payment_allocations.status Carries the persisted status value.
   * @evidenceReview prisma:vendor_payment_allocations.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:vendor_payment_allocations.description Carries the persisted description value.
   * @evidenceReview prisma:vendor_payment_allocations.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:vendor_payment_allocations.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:vendor_payment_allocations.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:vendor_payment_allocations.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:vendor_payment_allocations.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:vendor_payment_allocations.amount Carries the persisted amount value.
   * @evidenceReview prisma:vendor_payment_allocations.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:vendor_payment_allocations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:vendor_payment_allocations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:vendor_payment_allocations.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:vendor_payment_allocations.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:vendor_payment_allocations.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:vendor_payment_allocations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:vendor_payment_allocations.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:vendor_payment_allocations.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
