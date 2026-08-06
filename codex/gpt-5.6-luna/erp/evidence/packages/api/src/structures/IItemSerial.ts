import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:item_serials Exposes the persisted item_serials record.
 */
export interface IItemSerial {
  /** @evidence prisma:item_serials.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:item_serials.item_id Carries the persisted itemId value. */
  itemId: string & tags.Format<"uuid">;
/** @evidence prisma:item_serials.lot_id Carries the persisted lotId value. */
  lotId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:item_serials.serial_code Carries the persisted serialCode value. */
  serialCode: string;
/** @evidence prisma:item_serials.status Carries the persisted status value. */
  status: "available" | "quarantined" | "shipped" | "retired";
/** @evidence prisma:item_serials.location_id Carries the persisted locationId value. */
  locationId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:item_serials.origin Carries the persisted origin value. */
  origin: null | string;
/** @evidence prisma:item_serials.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:item_serials.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IItemSerial { export interface ICreate { itemId: string & tags.Format<"uuid">; lotId?: null | (string & tags.Format<"uuid">); serialCode: string & tags.MinLength<1>; origin?: null | string; locationId?: null | (string & tags.Format<"uuid">); } export interface IRequest extends IPage.IRequest { itemId?: string; lotId?: string; status?: IItemSerial["status"]; search?: string; } export interface IStatus { status: IItemSerial["status"]; } }
