import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Notification public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-notification-notification-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-notification-notification-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:notifications Represents the persisted notifications model.
 * @evidenceReview prisma:notifications Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface INotification extends IErpRecord {
  /** id.
   * @evidence prisma:notifications.id Carries the persisted id value.
   * @evidenceReview prisma:notifications.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:notifications.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:notifications.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:notifications.name Carries the persisted name value.
   * @evidenceReview prisma:notifications.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:notifications.status Carries the persisted status value.
   * @evidenceReview prisma:notifications.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:notifications.description Carries the persisted description value.
   * @evidenceReview prisma:notifications.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:notifications.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:notifications.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:notifications.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:notifications.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:notifications.amount Carries the persisted amount value.
   * @evidenceReview prisma:notifications.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:notifications.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:notifications.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:notifications.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:notifications.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:notifications.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:notifications.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:notifications.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:notifications.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
