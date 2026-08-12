import type { IPage } from "../typings";
import type { tags } from "typia";

/** Retained order with fixed purchase evidence and derived progress. */
export interface IShoppingOrder {
  /** Order UUID. */
  id: string & tags.Format<"uuid">;
  /** Immutable order number. */
  orderNumber: string;
  /** Customer UUID, retained for authorized history. */
  customerId: string & tags.Format<"uuid">;
  /** Purchase instant. */
  purchasedAt: string & tags.Format<"date-time">;
  /** Fixed total. */
  totalPrice: number;
  /** Derived overall status. */
  status: string;
  /** Immutable shipping destination. */
  shippingAddress: IShoppingOrder.IAddress;
  /** Independently progressing items. */
  items: IShoppingOrder.IItem[];
  /** Shipments. */
  shipments: IShoppingOrder.IShipment[];
}
export namespace IShoppingOrder {
  /** Immutable purchased address. */
  export interface IAddress { recipientName: string; recipientPhone: string; streetAddress: string; city: string; stateOrProvince: string; postalCode: string; country: string; }
  /** Order item with purchase-time facts. */
  export interface IItem { id: string & tags.Format<"uuid">; sellerId: string & tags.Format<"uuid">; productName: string; productDescription: string; skuCode: string; optionValues: Record<string, string>; sellerShopName: string; sellerLogoImage: string; quantity: number; unitPrice: number; status: string; purchasedAt: string & tags.Format<"date-time">; }
  /** Shipment package. */
  export interface IShipment { id: string & tags.Format<"uuid">; sellerId: string & tags.Format<"uuid">; carrier: string; trackingNumber: string; shippedAt: string & tags.Format<"date-time">; deliveredAt: string | null; itemIds: string[]; }
  /** Customer order listing request. */
  export interface IRequest extends IPage.IRequest { status?: string | null; }
  /** Checkout address and idempotency input. */
  export interface ICheckout { addressId: string & tags.Format<"uuid">; idempotencyKey: string & tags.MinLength<1>; paymentOutcome?: "success" | "failure"; }
  /** Order-item reason input. */
  export interface IReason { reason: string & tags.MinLength<1>; }
  /** Shipment creation input. */
  export interface IShipmentCreate { itemIds: string[] & tags.MinItems<1>; carrier: string & tags.MinLength<1>; trackingNumber: string & tags.MinLength<1>; }
  /** Report filter. */
  export interface IReportRequest extends IPage.IRequest { status?: "paid" | "shipped" | "delivered" | "cancelled" | "refunded" | null; }
}
