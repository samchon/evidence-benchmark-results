import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:boms Exposes the persisted boms record.
 */
export interface IBom {
  /** @evidence prisma:boms.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:boms.item_id Carries the persisted item_id value. */
  itemId: string & tags.Format<"uuid">;
  /** @evidence prisma:boms.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:boms.version Carries the persisted version value. */
  version: number;
  /** @evidence prisma:boms.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:boms.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:boms.created_at Carries the persisted created_at value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:boms.updated_at Carries the persisted updated_at value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IBom { export interface ICreate { itemId: string & tags.Format<"uuid">; code: string; version: number; quantity: number; } export interface IRequest extends IPage.IRequest { itemId?: string; status?: string; } export interface IStatus { status: "draft" | "released" | "obsolete"; } }
