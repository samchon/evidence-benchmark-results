import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * NotificationPreference public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-notification-preference-notification-preferences Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-notification-preference-notification-preferences Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:notification_preferences Represents the persisted notification_preferences model.
 * @evidenceReview prisma:notification_preferences Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface INotificationPreference extends IErpRecord {
  /** id.
   * @evidence prisma:notification_preferences.id Carries the persisted id value.
   * @evidenceReview prisma:notification_preferences.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:notification_preferences.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:notification_preferences.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:notification_preferences.name Carries the persisted name value.
   * @evidenceReview prisma:notification_preferences.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:notification_preferences.status Carries the persisted status value.
   * @evidenceReview prisma:notification_preferences.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:notification_preferences.description Carries the persisted description value.
   * @evidenceReview prisma:notification_preferences.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:notification_preferences.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:notification_preferences.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:notification_preferences.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:notification_preferences.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:notification_preferences.amount Carries the persisted amount value.
   * @evidenceReview prisma:notification_preferences.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:notification_preferences.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:notification_preferences.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:notification_preferences.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:notification_preferences.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:notification_preferences.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:notification_preferences.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:notification_preferences.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:notification_preferences.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
