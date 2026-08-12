import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * CustomFieldValue public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-customfield-custom-fields Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-customfield-custom-fields Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:custom_field_values Represents the persisted custom_field_values model.
 * @evidenceReview prisma:custom_field_values Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ICustomFieldValue extends IErpRecord {
  /** id.
   * @evidence prisma:custom_field_values.id Carries the persisted id value.
   * @evidenceReview prisma:custom_field_values.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:custom_field_values.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:custom_field_values.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:custom_field_values.name Carries the persisted name value.
   * @evidenceReview prisma:custom_field_values.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:custom_field_values.status Carries the persisted status value.
   * @evidenceReview prisma:custom_field_values.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:custom_field_values.description Carries the persisted description value.
   * @evidenceReview prisma:custom_field_values.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:custom_field_values.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:custom_field_values.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:custom_field_values.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:custom_field_values.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:custom_field_values.amount Carries the persisted amount value.
   * @evidenceReview prisma:custom_field_values.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:custom_field_values.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:custom_field_values.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:custom_field_values.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:custom_field_values.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:custom_field_values.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:custom_field_values.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:custom_field_values.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:custom_field_values.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
