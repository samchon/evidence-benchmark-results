import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Contact public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-contact-contacts Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-contact-contacts Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:contacts Represents the persisted contacts model.
 * @evidenceReview prisma:contacts Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IContact extends IErpRecord {
  /** id.
   * @evidence prisma:contacts.id Carries the persisted id value.
   * @evidenceReview prisma:contacts.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:contacts.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:contacts.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:contacts.name Carries the persisted name value.
   * @evidenceReview prisma:contacts.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:contacts.status Carries the persisted status value.
   * @evidenceReview prisma:contacts.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:contacts.description Carries the persisted description value.
   * @evidenceReview prisma:contacts.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:contacts.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:contacts.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:contacts.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:contacts.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:contacts.amount Carries the persisted amount value.
   * @evidenceReview prisma:contacts.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:contacts.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:contacts.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:contacts.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:contacts.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:contacts.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:contacts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:contacts.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:contacts.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
