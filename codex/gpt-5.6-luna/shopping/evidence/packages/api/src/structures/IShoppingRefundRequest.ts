import type { IPage } from "../typings";
import type { tags } from "typia";

/** Customer refund request for a delivered order item. */
export interface IShoppingRefundRequest {
  /** Request UUID. */
  id: string & tags.Format<"uuid">;
  /** Target order item UUID. */
  orderItemId: string & tags.Format<"uuid">;
  /** Customer reason. */
  reason: string;
  /** Pending, approved, or rejected. */
  status: string;
  /** Delivery deadline. */
  deadlineAt: string & tags.Format<"date-time">;
  /** Submission instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Decision instant, when decided. */
  decidedAt: string | null;
}
export namespace IShoppingRefundRequest {
  /** Request input. */
  export interface ICreate { orderItemId: string & tags.Format<"uuid">; reason: string & tags.MinLength<1>; }
  /** Seller decision input. */
  export interface IDecision { approve: boolean; reason?: string | null; }
  /** Seller queue query. */
  export type IRequest = IPage.IRequest;
}
