import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * PurchaseOrder public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-order-purchase-order-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-purchase-order-purchase-order-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:purchase_orders Represents the persisted purchase_orders model.
 * @evidenceReview prisma:purchase_orders Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IPurchaseOrder extends IErpRecord {
  /** id.
   * @evidence prisma:purchase_orders.id Carries the persisted id value.
   * @evidenceReview prisma:purchase_orders.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:purchase_orders.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:purchase_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:purchase_orders.name Carries the persisted name value.
   * @evidenceReview prisma:purchase_orders.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:purchase_orders.status Carries the persisted status value.
   * @evidenceReview prisma:purchase_orders.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:purchase_orders.description Carries the persisted description value.
   * @evidenceReview prisma:purchase_orders.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:purchase_orders.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:purchase_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:purchase_orders.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:purchase_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:purchase_orders.amount Carries the persisted amount value.
   * @evidenceReview prisma:purchase_orders.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:purchase_orders.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:purchase_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:purchase_orders.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:purchase_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:purchase_orders.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:purchase_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:purchase_orders.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:purchase_orders.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
