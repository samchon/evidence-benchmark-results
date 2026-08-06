import type { tags } from "typia";
import type { IPage } from "../typings";
/** Immutable organization audit event. */
/**
 * @evidence prisma:audit_events Exposes the persisted audit_events record.
 */
export interface IAuditEvent {
  /** @evidence prisma:audit_events.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:audit_events.user_id Carries the persisted userId value. */
  userId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:audit_events.system_principal_id Carries the persisted systemPrincipalId value. */
  systemPrincipalId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:audit_events.action Carries the persisted action value. */
  action: string;
/** @evidence prisma:audit_events.target_type Carries the persisted targetType value. */
  targetType: string;
/** @evidence prisma:audit_events.target_id Carries the persisted targetId value. */
  targetId: string;
/** @evidence prisma:audit_events.before_value Carries the persisted beforeValue value. */
  beforeValue: null | string;
/** @evidence prisma:audit_events.after_value Carries the persisted afterValue value. */
  afterValue: null | string;
/** @evidence prisma:audit_events.reason Carries the persisted reason value. */
  reason: null | string;
/** @evidence prisma:audit_events.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IAuditEvent { export interface IRequest extends IPage.IRequest { action?: string; targetType?: string; targetId?: string; } }
