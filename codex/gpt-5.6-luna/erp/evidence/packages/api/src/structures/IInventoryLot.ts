import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:inventory_lots Exposes the persisted inventory_lots record.
 */
export interface IInventoryLot {
  /** @evidence prisma:inventory_lots.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:inventory_lots.item_id Carries the persisted itemId value. */
  itemId: string & tags.Format<"uuid">;
  /** @evidence prisma:inventory_lots.lot_code Carries the persisted lotCode value. */
  lotCode: string;
  /** @evidence prisma:inventory_lots.origin Carries the persisted origin value. */
  origin: null | string;
  /** @evidence prisma:inventory_lots.status Carries the persisted status value. */
  status: "available" | "quarantined" | "closed";
  /** @evidence prisma:inventory_lots.received_at Carries the persisted receivedAt value. */
  receivedAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:inventory_lots.expires_at Carries the persisted expiresAt value. */
  expiresAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:inventory_lots.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:inventory_lots.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:inventory_lots.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IInventoryLot { export interface ICreate { itemId: string & tags.Format<"uuid">; lotCode: string & tags.MinLength<1>; origin?: null | string; receivedAt?: null | (string & tags.Format<"date-time">); expiresAt?: null | (string & tags.Format<"date-time">); quantity?: number; } export interface IRequest extends IPage.IRequest { itemId?: string; status?: IInventoryLot["status"]; search?: string; } export interface IStatus { status: IInventoryLot["status"]; } }
