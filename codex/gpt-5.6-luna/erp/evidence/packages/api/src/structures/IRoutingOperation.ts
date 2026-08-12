import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * RoutingOperation public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-routing-routing-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-routing-routing-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:routing_operations Represents the persisted routing_operations model.
 * @evidenceReview prisma:routing_operations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IRoutingOperation extends IErpRecord {
  /** id.
   * @evidence prisma:routing_operations.id Carries the persisted id value.
   * @evidenceReview prisma:routing_operations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:routing_operations.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:routing_operations.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:routing_operations.name Carries the persisted name value.
   * @evidenceReview prisma:routing_operations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:routing_operations.status Carries the persisted status value.
   * @evidenceReview prisma:routing_operations.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:routing_operations.description Carries the persisted description value.
   * @evidenceReview prisma:routing_operations.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:routing_operations.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:routing_operations.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:routing_operations.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:routing_operations.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:routing_operations.amount Carries the persisted amount value.
   * @evidenceReview prisma:routing_operations.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:routing_operations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:routing_operations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:routing_operations.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:routing_operations.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:routing_operations.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:routing_operations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:routing_operations.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:routing_operations.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
