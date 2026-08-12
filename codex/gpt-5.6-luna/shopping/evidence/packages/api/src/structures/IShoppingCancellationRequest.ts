import type { IPage } from "../typings";
import type { tags } from "typia";

/** Customer cancellation request and immutable decision state. */
export interface IShoppingCancellationRequest {
  /** Request UUID. */
  id: string & tags.Format<"uuid">;
  /** Target order item UUID. */
  orderItemId: string & tags.Format<"uuid">;
  /** Reason submitted by the customer. */
  reason: string;
  /** Pending, approved, or rejected. */
  status: string;
  /** Submission instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Decision instant, when decided. */
  decidedAt: string | null;
}
export namespace IShoppingCancellationRequest {
  /** Request input. */
  export interface ICreate { orderItemId: string & tags.Format<"uuid">; reason: string & tags.MinLength<1>; }
  /** Seller decision input. */
  export interface IDecision { approve: boolean; reason?: string | null; }
  /** Seller queue query. */
  export type IRequest = IPage.IRequest;
}
