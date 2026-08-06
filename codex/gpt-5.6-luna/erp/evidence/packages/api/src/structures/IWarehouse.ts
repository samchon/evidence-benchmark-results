import type { tags } from "typia";
import type { IPage } from "../typings";
/** Inventory warehouse. */
/**
 * @evidence prisma:warehouses Exposes the persisted warehouses record.
 */
export interface IWarehouse {
  /** @evidence prisma:warehouses.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:warehouses.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:warehouses.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:warehouses.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:warehouses.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:warehouses.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IWarehouse { export interface ICreate { code: string & tags.MinLength<1>; name: string & tags.MinLength<1>; } export interface IUpdate { name?: string; } export interface IRequest extends IPage.IRequest { search?: string; includeInactive?: boolean; } }
