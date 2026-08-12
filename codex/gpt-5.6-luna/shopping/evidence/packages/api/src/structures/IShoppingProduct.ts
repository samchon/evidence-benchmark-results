import type { IPage } from "../typings";
import type { tags } from "typia";
import type { IShoppingProductVariant } from "./IShoppingProductVariant";

/** Seller-owned product and its live discovery aggregate. */
export interface IShoppingProduct {
  /** Product UUID. */
  id: string & tags.Format<"uuid">;
  /** Seller owner UUID. */
  sellerId: string & tags.Format<"uuid">;
  /** Optional category UUID. */
  categoryId: string | null;
  /** Product name. */
  name: string;
  /** Product description. */
  description: string;
  /** Base price. */
  basePrice: number;
  /** Ordered image references. */
  images: string[];
  /** Live variants. */
  variants: IShoppingProductVariant[];
  /** Effective availability presentation. */
  availability: string;
  /** Current live review average. */
  rating: number;
  /** Current non-deleted review count. */
  reviewCount: number;
  /** Creation instant. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IShoppingProduct {
  /** Compact discovery card. */
  export interface ISummary { id: IShoppingProduct["id"]; name: string; description: string; basePrice: number; thumbnail: string | null; sellerId: IShoppingProduct["sellerId"]; sellerShopName: string; availability: string; rating: number; reviewCount: number; }
  /** Product creation input. */
  export interface ICreate { name: string & tags.MinLength<1>; description: string & tags.MinLength<1>; categoryId?: string | null; basePrice: number & tags.Minimum<0>; }
  /** Product update input. */
  export type IUpdate = ICreate;
  /** Discovery filters and stable sort. */
  export interface IRequest extends IPage.IRequest { search?: string | null; categoryId?: string | null; minimumPrice?: number | null; maximumPrice?: number | null; inStockOnly?: boolean | null; sort?: "newest" | "priceAsc" | "priceDesc" | "name"; }
  /** Policy retirement input. */
  export interface IDelete { reason: string & tags.MinLength<1>; }
  /** Ordered image mutation. */
  export interface IImageCreate { uri: string & tags.MinLength<1>; }
  /** Reorder input. */
  export interface IImageReorder { imageIds: string[] & tags.MinItems<1>; }
  /** Variant creation input. */
  export interface IVariantCreate { skuCode: string & tags.MinLength<1>; optionValues: Record<string, string>; priceOverride?: number | null; }
  /** Variant update input. */
  export type IVariantUpdate = IVariantCreate;
  /** Snapshot list input. */
  export type ISnapshotRequest = IPage.IRequest;
}
