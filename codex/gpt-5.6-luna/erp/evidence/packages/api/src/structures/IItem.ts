import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Item public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-item-item-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-item-item-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:items Represents the persisted items model.
 * @evidenceReview prisma:items Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IItem extends IErpRecord {
  /** id.
   * @evidence prisma:items.id Carries the persisted id value.
   * @evidenceReview prisma:items.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:items.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:items.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:items.name Carries the persisted name value.
   * @evidenceReview prisma:items.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:items.status Carries the persisted status value.
   * @evidenceReview prisma:items.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:items.description Carries the persisted description value.
   * @evidenceReview prisma:items.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:items.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:items.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:items.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:items.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:items.amount Carries the persisted amount value.
   * @evidenceReview prisma:items.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:items.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:items.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:items.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:items.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:items.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:items.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:items.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:items.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
