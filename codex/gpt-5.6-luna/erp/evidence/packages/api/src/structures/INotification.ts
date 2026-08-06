import type { tags } from "typia"; import type { IPage } from "../typings";
/** Organization notification and delivery state.
 */
/**
 * @evidence prisma:notifications Exposes the persisted notifications record.
 */
export interface INotification {
  /** @evidence prisma:notifications.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:notifications.user_id Carries the persisted userId value. */
  userId: string & tags.Format<"uuid">;
/** @evidence prisma:notifications.notification_type Carries the persisted notificationType value. */
  notificationType: string;
/** @evidence prisma:notifications.title Carries the persisted title value. */
  title: string;
/** @evidence prisma:notifications.body Carries the persisted body value. */
  body: string;
/** @evidence prisma:notifications.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:notifications.read_at Carries the persisted readAt value. */
  readAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:notifications.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:notifications.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace INotification { export interface ICreate { userId: string & tags.Format<"uuid">; notificationType: string; title: string; body: string; } export interface IRequest extends IPage.IRequest { userId?: string; status?: string; } export interface IStatus { status: "queued" | "sent" | "failed" | "unread" | "read" | "archived"; } }
