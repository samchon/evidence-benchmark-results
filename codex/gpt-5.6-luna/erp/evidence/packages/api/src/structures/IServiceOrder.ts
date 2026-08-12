import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * ServiceOrder public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-service-order-service-order-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-service-order-service-order-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:service_orders Represents the persisted service_orders model.
 * @evidenceReview prisma:service_orders Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IServiceOrder extends IErpRecord {
  /** id.
   * @evidence prisma:service_orders.id Carries the persisted id value.
   * @evidenceReview prisma:service_orders.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:service_orders.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:service_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:service_orders.name Carries the persisted name value.
   * @evidenceReview prisma:service_orders.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:service_orders.status Carries the persisted status value.
   * @evidenceReview prisma:service_orders.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:service_orders.description Carries the persisted description value.
   * @evidenceReview prisma:service_orders.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:service_orders.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:service_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:service_orders.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:service_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:service_orders.amount Carries the persisted amount value.
   * @evidenceReview prisma:service_orders.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:service_orders.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:service_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:service_orders.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:service_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:service_orders.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:service_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:service_orders.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:service_orders.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
