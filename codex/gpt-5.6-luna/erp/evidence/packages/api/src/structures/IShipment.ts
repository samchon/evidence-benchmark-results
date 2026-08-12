import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Shipment public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-shipment-shipment-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-shipment-shipment-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:shipments Represents the persisted shipments model.
 * @evidenceReview prisma:shipments Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IShipment extends IErpRecord {
  /** id.
   * @evidence prisma:shipments.id Carries the persisted id value.
   * @evidenceReview prisma:shipments.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:shipments.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:shipments.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:shipments.name Carries the persisted name value.
   * @evidenceReview prisma:shipments.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:shipments.status Carries the persisted status value.
   * @evidenceReview prisma:shipments.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:shipments.description Carries the persisted description value.
   * @evidenceReview prisma:shipments.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:shipments.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:shipments.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:shipments.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:shipments.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:shipments.amount Carries the persisted amount value.
   * @evidenceReview prisma:shipments.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:shipments.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:shipments.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:shipments.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:shipments.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:shipments.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:shipments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:shipments.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:shipments.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
