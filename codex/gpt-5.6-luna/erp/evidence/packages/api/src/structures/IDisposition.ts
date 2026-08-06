import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:dispositions Exposes the persisted dispositions record.
 */
export interface IDisposition {
  /** @evidence prisma:dispositions.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:dispositions.quarantine_id Carries the persisted quarantineId value. */
  quarantineId: string & tags.Format<"uuid">;
/** @evidence prisma:dispositions.disposition_type Carries the persisted dispositionType value. */
  dispositionType: string;
/** @evidence prisma:dispositions.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:dispositions.quantity Carries the persisted quantity value. */
  quantity: number;
/** @evidence prisma:dispositions.reason Carries the persisted reason value. */
  reason: null | string;
/** @evidence prisma:dispositions.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:dispositions.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IDisposition { export interface ICreate { quarantineId: string & tags.Format<"uuid">; dispositionType: string; quantity: number; reason?: null | string; } export interface IRequest extends IPage.IRequest { quarantineId?: string; status?: string; } export interface IStatus { status: "draft" | "approved" | "posted" | "cancelled"; } }
