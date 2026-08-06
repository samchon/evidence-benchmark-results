import type { tags } from "typia";
import type { IPage } from "../typings";
/** Inventory item master. */
/**
 * @evidence prisma:items Exposes the persisted items record.
 */
export interface IItem {
  /** @evidence prisma:items.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:items.sku Carries the persisted sku value. */
  sku: string;
  /** @evidence prisma:items.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:items.description Carries the persisted description value. */
  description: null | string;
  /** @evidence prisma:items.item_type Carries the persisted item_type value. */
  itemType: string;
  /** @evidence prisma:items.uom_id Carries the persisted uom_id value. */
  uomId: null | string;
/** @evidence prisma:items.tracking_mode Carries the persisted trackingMode value. */
  trackingMode: "none" | "lot" | "serial";
/** @evidence prisma:items.reorder_point Carries the persisted reorderPoint value. */
  reorderPoint: null | number;
  /** @evidence prisma:items.active Carries the persisted active value. */
  active: boolean;
  /** @evidence prisma:items.created_at Carries the persisted created_at value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:items.updated_at Carries the persisted updated_at value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IItem { export interface ICreate { sku: string & tags.MinLength<1>; name: string & tags.MinLength<1>; description?: null | string; itemType: string & tags.MinLength<1>; uomId?: null | string; trackingMode: IItem["trackingMode"]; reorderPoint?: null | number; } export interface IUpdate { name?: string; description?: null | string; uomId?: null | string; trackingMode?: IItem["trackingMode"]; reorderPoint?: null | number; } export interface IRequest extends IPage.IRequest { search?: string; trackingMode?: IItem["trackingMode"]; includeInactive?: boolean; } }
