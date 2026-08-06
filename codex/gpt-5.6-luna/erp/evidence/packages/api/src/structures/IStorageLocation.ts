import type { tags } from "typia";
import type { IPage } from "../typings";
/** Hierarchical warehouse storage location. */
/**
 * @evidence prisma:storage_locations Exposes the persisted storage_locations record.
 */
export interface IStorageLocation {
  /** @evidence prisma:storage_locations.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:storage_locations.warehouse_id Carries the persisted warehouseId value. */
  warehouseId: string & tags.Format<"uuid">;
  /** @evidence prisma:storage_locations.parent_id Carries the persisted parentId value. */
  parentId: null | (string & tags.Format<"uuid">);
  /** @evidence prisma:storage_locations.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:storage_locations.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:storage_locations.depth Carries the persisted depth value. */
  depth: number;
  /** @evidence prisma:storage_locations.active Carries the persisted active value. */
  active: boolean;
  /** @evidence prisma:storage_locations.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:storage_locations.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IStorageLocation { export interface ICreate { warehouseId: string & tags.Format<"uuid">; parentId?: null | string; code: string & tags.MinLength<1>; name: string & tags.MinLength<1>; } export interface IUpdate { name?: string; } export interface IRequest extends IPage.IRequest { warehouseId?: string; parentId?: string; search?: string; includeInactive?: boolean; } }
