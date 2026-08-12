import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * CustomField public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-customfield-custom-fields Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-customfield-custom-fields Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:custom_fields Represents the persisted custom_fields model.
 * @evidenceReview prisma:custom_fields Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ICustomField extends IErpRecord {
  /** id.
   * @evidence prisma:custom_fields.id Carries the persisted id value.
   * @evidenceReview prisma:custom_fields.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:custom_fields.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:custom_fields.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:custom_fields.name Carries the persisted name value.
   * @evidenceReview prisma:custom_fields.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:custom_fields.status Carries the persisted status value.
   * @evidenceReview prisma:custom_fields.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:custom_fields.description Carries the persisted description value.
   * @evidenceReview prisma:custom_fields.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:custom_fields.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:custom_fields.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:custom_fields.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:custom_fields.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:custom_fields.amount Carries the persisted amount value.
   * @evidenceReview prisma:custom_fields.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:custom_fields.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:custom_fields.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:custom_fields.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:custom_fields.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:custom_fields.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:custom_fields.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:custom_fields.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:custom_fields.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
