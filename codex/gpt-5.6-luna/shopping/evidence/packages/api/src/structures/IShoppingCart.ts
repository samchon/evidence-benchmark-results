import type { IPage } from "../typings";
import type { tags } from "typia";

/** Customer cart with current price and availability projections. */
export interface IShoppingCart {
  /** Cart UUID. */
  id: string & tags.Format<"uuid">;
  /** Visible cart lines. */
  lines: IShoppingCart.ILine[];
  /** Sum of displayed current subtotals. */
  total: number;
}
export namespace IShoppingCart {
  /** One cart line. */
  export interface ILine { id: string & tags.Format<"uuid">; variantId: string & tags.Format<"uuid">; productId: string & tags.Format<"uuid">; productName: string; optionValues: Record<string, string>; unitPrice: number; quantity: number; subtotal: number; availability: string; }
  /** Add or merge a variant line. */
  export interface ICreate { variantId: string & tags.Format<"uuid">; quantity: number & tags.Type<"uint32"> & tags.Minimum<1>; }
  /** Replace a line quantity. */
  export interface IUpdate { quantity: number & tags.Type<"uint32"> & tags.Minimum<1>; }
  /** Cart line paging input. */
  export type IRequest = IPage.IRequest;
}
