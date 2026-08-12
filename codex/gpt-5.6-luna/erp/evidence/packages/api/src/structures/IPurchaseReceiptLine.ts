import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * PurchaseReceiptLine public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-receipt-purchase-receipt-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-purchase-receipt-purchase-receipt-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:purchase_receipt_lines Represents the persisted purchase_receipt_lines model.
 * @evidenceReview prisma:purchase_receipt_lines Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IPurchaseReceiptLine extends IErpRecord {
  /** id.
   * @evidence prisma:purchase_receipt_lines.id Carries the persisted id value.
   * @evidenceReview prisma:purchase_receipt_lines.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:purchase_receipt_lines.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:purchase_receipt_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:purchase_receipt_lines.name Carries the persisted name value.
   * @evidenceReview prisma:purchase_receipt_lines.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:purchase_receipt_lines.status Carries the persisted status value.
   * @evidenceReview prisma:purchase_receipt_lines.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:purchase_receipt_lines.description Carries the persisted description value.
   * @evidenceReview prisma:purchase_receipt_lines.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:purchase_receipt_lines.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:purchase_receipt_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:purchase_receipt_lines.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:purchase_receipt_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:purchase_receipt_lines.amount Carries the persisted amount value.
   * @evidenceReview prisma:purchase_receipt_lines.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:purchase_receipt_lines.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:purchase_receipt_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:purchase_receipt_lines.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:purchase_receipt_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:purchase_receipt_lines.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:purchase_receipt_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:purchase_receipt_lines.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:purchase_receipt_lines.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
