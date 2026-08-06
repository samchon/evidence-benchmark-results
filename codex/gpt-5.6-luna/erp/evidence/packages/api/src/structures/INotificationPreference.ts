import type { tags } from "typia";
/** Per-membership notification delivery preference. */
/**
 * @evidence prisma:notification_preferences Exposes the persisted notification_preferences record.
 */
export interface INotificationPreference {
  /** @evidence prisma:notification_preferences.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:notification_preferences.membership_id Carries the persisted membershipId value. */
  membershipId: string & tags.Format<"uuid">;
  /** @evidence prisma:notification_preferences.email_enabled Carries the persisted emailEnabled value. */
  emailEnabled: boolean;
  /** @evidence prisma:notification_preferences.in_app_enabled Carries the persisted inAppEnabled value. */
  inAppEnabled: boolean;
  /** @evidence prisma:notification_preferences.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:notification_preferences.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace INotificationPreference { export interface IUpdate { emailEnabled?: boolean; inAppEnabled?: boolean; } }
