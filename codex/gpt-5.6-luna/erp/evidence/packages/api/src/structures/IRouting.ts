import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:routings Exposes the persisted routings record.
 */
export interface IRouting {
  /** @evidence prisma:routings.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:routings.item_id Carries the persisted item_id value. */
  itemId: string & tags.Format<"uuid">;
  /** @evidence prisma:routings.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:routings.version Carries the persisted version value. */
  version: number;
  /** @evidence prisma:routings.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:routings.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:routings.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IRouting { export interface ICreate { itemId: string & tags.Format<"uuid">; code: string; version: number; } export interface IRequest extends IPage.IRequest { itemId?: string; status?: string; } export interface IStatus { status: "draft" | "released" | "obsolete"; } }
