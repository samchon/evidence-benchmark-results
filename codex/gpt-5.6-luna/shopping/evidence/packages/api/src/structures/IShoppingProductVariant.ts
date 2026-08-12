import type { IPage } from "../typings";
import type { tags } from "typia";

/** One concrete product SKU and its derived stock. */
export interface IShoppingProductVariant {
  /** Variant UUID. */
  id: string & tags.Format<"uuid">;
  /** Product UUID. */
  productId: string & tags.Format<"uuid">;
  /** Unique SKU code. */
  skuCode: string;
  /** Concrete option values. */
  optionValues: Record<string, string>;
  /** Optional effective-price override. */
  priceOverride: number | null;
  /** Current stock, derived from the movement ledger. */
  stock: number;
  /** Live or retired presentation. */
  availability: string;
  /** Creation instant. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IShoppingProductVariant {
  /** Variant creation and edit fields. */
  export interface ICreate { skuCode: string & tags.MinLength<1>; optionValues: Record<string, string>; priceOverride?: number | null; }
  /** Variant edit fields. */
  export type IUpdate = ICreate;
  /** Inventory movement input. */
  export interface IMovement { quantity: number & tags.Type<"int32">; reason: string & tags.MinLength<1>; }
  /** Inventory history query. */
  export type IRequest = IPage.IRequest;
  /** Inventory history row. */
  export interface IMovementSummary { id: string & tags.Format<"uuid">; quantity: number; reason: string; createdAt: string & tags.Format<"date-time">; }
}
