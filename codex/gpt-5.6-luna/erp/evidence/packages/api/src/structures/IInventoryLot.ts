import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * InventoryLot public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-lot-inventory-lots Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-lot-inventory-lots Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:inventory_lots Represents the persisted inventory_lots model.
 * @evidenceReview prisma:inventory_lots Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IInventoryLot extends IErpRecord {
  /** id.
   * @evidence prisma:inventory_lots.id Carries the persisted id value.
   * @evidenceReview prisma:inventory_lots.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:inventory_lots.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:inventory_lots.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:inventory_lots.name Carries the persisted name value.
   * @evidenceReview prisma:inventory_lots.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:inventory_lots.status Carries the persisted status value.
   * @evidenceReview prisma:inventory_lots.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:inventory_lots.description Carries the persisted description value.
   * @evidenceReview prisma:inventory_lots.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:inventory_lots.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:inventory_lots.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:inventory_lots.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:inventory_lots.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:inventory_lots.amount Carries the persisted amount value.
   * @evidenceReview prisma:inventory_lots.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:inventory_lots.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:inventory_lots.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:inventory_lots.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:inventory_lots.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:inventory_lots.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:inventory_lots.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:inventory_lots.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:inventory_lots.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
