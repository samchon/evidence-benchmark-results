import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:quarantines Exposes the persisted quarantines record.
 */
export interface IQuarantine {
  /** @evidence prisma:quarantines.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:quarantines.item_id Carries the persisted itemId value. */
  itemId: string & tags.Format<"uuid">;
/** @evidence prisma:quarantines.lot_id Carries the persisted lotId value. */
  lotId: null | string;
/** @evidence prisma:quarantines.serial_id Carries the persisted serialId value. */
  serialId: null | string;
/** @evidence prisma:quarantines.quantity Carries the persisted quantity value. */
  quantity: number;
/** @evidence prisma:quarantines.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:quarantines.reason Carries the persisted reason value. */
  reason: null | string;
/** @evidence prisma:quarantines.quarantined_at Carries the persisted quarantinedAt value. */
  quarantinedAt: string & tags.Format<"date-time">;
/** @evidence prisma:quarantines.released_at Carries the persisted releasedAt value. */
  releasedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:quarantines.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:quarantines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IQuarantine { export interface ICreate { itemId: string & tags.Format<"uuid">; lotId?: null | string; serialId?: null | string; quantity: number; reason?: null | string; } export interface IRequest extends IPage.IRequest { itemId?: string; status?: string; } export interface IStatus { status: "quarantined" | "released" | "disposed"; } }
