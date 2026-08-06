import type { tags } from "typia";
import type { IPage } from "../typings";
/** Immutable inventory quantity movement. */
/**
 * @evidence prisma:stock_movements Exposes the persisted stock_movements record.
 */
export interface IStockMovement {
  /** @evidence prisma:stock_movements.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:stock_movements.item_id Carries the persisted itemId value. */
  itemId: string & tags.Format<"uuid">;
  /** @evidence prisma:stock_movements.warehouse_id Carries the persisted warehouseId value. */
  warehouseId: string & tags.Format<"uuid">;
  /** @evidence prisma:stock_movements.location_id Carries the persisted locationId value. */
  locationId: null | (string & tags.Format<"uuid">);
  /** @evidence prisma:stock_movements.movement_type Carries the persisted movementType value. */
  movementType: string;
  /** @evidence prisma:stock_movements.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:stock_movements.unit_cost Carries the persisted unitCost value. */
  unitCost: null | number;
  /** @evidence prisma:stock_movements.currency_code Carries the persisted currencyCode value. */
  currencyCode: null | string;
  /** @evidence prisma:stock_movements.source_type Carries the persisted sourceType value. */
  sourceType: string;
  /** @evidence prisma:stock_movements.source_id Carries the persisted sourceId value. */
  sourceId: string;
  /** @evidence prisma:stock_movements.lot_id Carries the persisted lotId value. */
  lotId: null | string;
  /** @evidence prisma:stock_movements.serial_id Carries the persisted serialId value. */
  serialId: null | string;
  /** @evidence prisma:stock_movements.occurred_at Carries the persisted occurredAt value. */
  occurredAt: string & tags.Format<"date-time">;
  /** @evidence prisma:stock_movements.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IStockMovement { export interface ICreate { itemId: string & tags.Format<"uuid">; warehouseId: string & tags.Format<"uuid">; locationId?: null | string; movementType: string & tags.MinLength<1>; quantity: number; unitCost?: null | number; currencyCode?: null | string; sourceType: string & tags.MinLength<1>; sourceId: string & tags.Format<"uuid">; lotId?: null | string; serialId?: null | string; occurredAt: string & tags.Format<"date-time">; } export interface IRequest extends IPage.IRequest { itemId?: string; warehouseId?: string; movementType?: string; } export interface IQuantity { itemId: string; warehouseId: string; quantity: number; } }
