import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * VendorCredit public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-credit-vendor-credits Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vendor-credit-vendor-credits Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:vendor_credits Represents the persisted vendor_credits model.
 * @evidenceReview prisma:vendor_credits Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IVendorCredit extends IErpRecord {
  /** id.
   * @evidence prisma:vendor_credits.id Carries the persisted id value.
   * @evidenceReview prisma:vendor_credits.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:vendor_credits.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:vendor_credits.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:vendor_credits.name Carries the persisted name value.
   * @evidenceReview prisma:vendor_credits.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:vendor_credits.status Carries the persisted status value.
   * @evidenceReview prisma:vendor_credits.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:vendor_credits.description Carries the persisted description value.
   * @evidenceReview prisma:vendor_credits.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:vendor_credits.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:vendor_credits.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:vendor_credits.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:vendor_credits.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:vendor_credits.amount Carries the persisted amount value.
   * @evidenceReview prisma:vendor_credits.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:vendor_credits.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:vendor_credits.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:vendor_credits.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:vendor_credits.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:vendor_credits.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:vendor_credits.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:vendor_credits.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:vendor_credits.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
