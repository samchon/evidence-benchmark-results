import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * ProductionOrderOperation public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-production-order-production-order-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-production-order-production-order-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:production_order_operations Represents the persisted production_order_operations model.
 * @evidenceReview prisma:production_order_operations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IProductionOrderOperation extends IErpRecord {
  /** id.
   * @evidence prisma:production_order_operations.id Carries the persisted id value.
   * @evidenceReview prisma:production_order_operations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:production_order_operations.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:production_order_operations.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:production_order_operations.name Carries the persisted name value.
   * @evidenceReview prisma:production_order_operations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:production_order_operations.status Carries the persisted status value.
   * @evidenceReview prisma:production_order_operations.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:production_order_operations.description Carries the persisted description value.
   * @evidenceReview prisma:production_order_operations.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:production_order_operations.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:production_order_operations.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:production_order_operations.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:production_order_operations.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:production_order_operations.amount Carries the persisted amount value.
   * @evidenceReview prisma:production_order_operations.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:production_order_operations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:production_order_operations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:production_order_operations.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:production_order_operations.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:production_order_operations.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:production_order_operations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:production_order_operations.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:production_order_operations.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
