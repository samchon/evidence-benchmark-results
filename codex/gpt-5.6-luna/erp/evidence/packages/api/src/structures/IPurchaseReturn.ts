import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * PurchaseReturn public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-return-purchase-returns Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-purchase-return-purchase-returns Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:purchase_returns Represents the persisted purchase_returns model.
 * @evidenceReview prisma:purchase_returns Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IPurchaseReturn extends IErpRecord {
  /** id.
   * @evidence prisma:purchase_returns.id Carries the persisted id value.
   * @evidenceReview prisma:purchase_returns.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:purchase_returns.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:purchase_returns.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:purchase_returns.name Carries the persisted name value.
   * @evidenceReview prisma:purchase_returns.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:purchase_returns.status Carries the persisted status value.
   * @evidenceReview prisma:purchase_returns.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:purchase_returns.description Carries the persisted description value.
   * @evidenceReview prisma:purchase_returns.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:purchase_returns.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:purchase_returns.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:purchase_returns.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:purchase_returns.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:purchase_returns.amount Carries the persisted amount value.
   * @evidenceReview prisma:purchase_returns.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:purchase_returns.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:purchase_returns.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:purchase_returns.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:purchase_returns.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:purchase_returns.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:purchase_returns.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:purchase_returns.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:purchase_returns.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
