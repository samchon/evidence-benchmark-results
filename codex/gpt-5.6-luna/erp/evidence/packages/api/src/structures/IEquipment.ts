import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Equipment public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-equipment-equipment-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-equipment-equipment-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:equipment Represents the persisted equipment model.
 * @evidenceReview prisma:equipment Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IEquipment extends IErpRecord {
  /** id.
   * @evidence prisma:equipment.id Carries the persisted id value.
   * @evidenceReview prisma:equipment.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:equipment.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:equipment.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:equipment.name Carries the persisted name value.
   * @evidenceReview prisma:equipment.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:equipment.status Carries the persisted status value.
   * @evidenceReview prisma:equipment.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:equipment.description Carries the persisted description value.
   * @evidenceReview prisma:equipment.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:equipment.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:equipment.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:equipment.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:equipment.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:equipment.amount Carries the persisted amount value.
   * @evidenceReview prisma:equipment.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:equipment.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:equipment.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:equipment.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:equipment.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:equipment.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:equipment.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:equipment.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:equipment.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
