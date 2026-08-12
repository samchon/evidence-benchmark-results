import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * InspectionOrder public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-inspection-order-inspection-order-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-inspection-order-inspection-order-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:inspection_orders Represents the persisted inspection_orders model.
 * @evidenceReview prisma:inspection_orders Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IInspectionOrder extends IErpRecord {
  /** id.
   * @evidence prisma:inspection_orders.id Carries the persisted id value.
   * @evidenceReview prisma:inspection_orders.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:inspection_orders.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:inspection_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:inspection_orders.name Carries the persisted name value.
   * @evidenceReview prisma:inspection_orders.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:inspection_orders.status Carries the persisted status value.
   * @evidenceReview prisma:inspection_orders.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:inspection_orders.description Carries the persisted description value.
   * @evidenceReview prisma:inspection_orders.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:inspection_orders.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:inspection_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:inspection_orders.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:inspection_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:inspection_orders.amount Carries the persisted amount value.
   * @evidenceReview prisma:inspection_orders.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:inspection_orders.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:inspection_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:inspection_orders.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:inspection_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:inspection_orders.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:inspection_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:inspection_orders.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:inspection_orders.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
