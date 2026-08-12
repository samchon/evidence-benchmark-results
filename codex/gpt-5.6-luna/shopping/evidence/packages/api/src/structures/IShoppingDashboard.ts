import type { IPage } from "../typings";

/** Seller reporting values observed at one reporting moment. */
export interface IShoppingDashboard {
  /** Current retained product count. */
  productCount: number;
  /** Retained seller-attributed order item count. */
  orderItemCount: number;
  /** Pending cancellation workload. */
  pendingCancellationCount: number;
  /** Pending refund workload. */
  pendingRefundCount: number;
  /** Observation instant. */
  observedAt: string;
}
export namespace IShoppingDashboard {
  /** Report query. */
  export interface IRequest extends IPage.IRequest { status?: "paid" | "shipped" | "delivered" | "cancelled" | "refunded" | null; }
}
