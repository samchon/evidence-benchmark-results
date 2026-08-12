import type { IPage } from "../typings";
import type { tags } from "typia";

/** Verified customer product feedback and its live lifecycle. */
export interface IShoppingReview {
  /** Review UUID. */
  id: string & tags.Format<"uuid">;
  /** Author UUID or anonymous deleted-user presentation. */
  customerId: string | null;
  /** Product UUID retained after product retirement. */
  productId: string & tags.Format<"uuid">;
  /** Qualifying order UUID. */
  orderId: string & tags.Format<"uuid">;
  /** Rating from one through five. */
  rating: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<5>;
  /** Optional review text. */
  text: string | null;
  /** Original publication instant. */
  publishedAt: string & tags.Format<"date-time">;
  /** Whether the author is shown as deleted user. */
  anonymized: boolean;
}
export namespace IShoppingReview {
  /** Review publication input. */
  export interface ICreate { productId: string & tags.Format<"uuid">; orderId: string & tags.Format<"uuid">; rating: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<5>; text?: string | null; }
  /** Review edit input. */
  export interface IUpdate { rating: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<5>; text?: string | null; }
  /** Public review query. */
  export type IRequest = IPage.IRequest;
}
