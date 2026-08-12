import type { IPage } from "../typings";
import type { tags } from "typia";

/** Customer-owned product wishlist membership. */
export interface IShoppingWishlist {
  /** Entry UUID. */
  id: string & tags.Format<"uuid">;
  /** Saved product UUID. */
  productId: string & tags.Format<"uuid">;
  /** Save instant. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IShoppingWishlist {
  /** Product save input. */
  export interface ICreate { productId: string & tags.Format<"uuid">; }
  /** Wishlist paging input. */
  export type IRequest = IPage.IRequest;
}
