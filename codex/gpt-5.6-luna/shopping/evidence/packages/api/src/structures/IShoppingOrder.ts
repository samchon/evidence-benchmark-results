import type { tags } from "typia";
import type { IPage } from "../typings";

/**
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-order-model This DTO family represents req-order-domain order model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-1-define-order-information This DTO family represents req-order-domain-1 define order information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-5-relate-items-to-fulfillment-and-after-sales-records This DTO family represents req-order-domain-5 relate items to fulfillment and after-sales records at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states This DTO family represents req-order-item-lifecycle order item states at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-1-begin-items-in-paid-status This DTO family represents req-order-item-lifecycle-1 begin items in paid status at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-2-transition-paid-items-to-shipped This DTO family represents req-order-item-lifecycle-2 transition paid items to shipped at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-3-transition-shipped-items-to-delivered This DTO family represents req-order-item-lifecycle-3 transition shipped items to delivered at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-4-transition-an-item-to-cancelled This DTO family represents req-order-item-lifecycle-4 transition an item to cancelled at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-5-transition-an-item-to-refunded This DTO family represents req-order-item-lifecycle-5 transition an item to refunded at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-6-preserve-item-facts-across-status-changes This DTO family represents req-order-item-lifecycle-6 preserve item facts across status changes at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states This DTO family represents req-order-lifecycle derived order states at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-1-derive-paid-order-status This DTO family represents req-order-lifecycle-1 derive paid order status at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-2-derive-shipped-order-status This DTO family represents req-order-lifecycle-2 derive shipped order status at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-3-derive-delivered-order-status This DTO family represents req-order-lifecycle-3 derive delivered order status at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-4-derive-cancelled-order-status This DTO family represents req-order-lifecycle-4 derive cancelled order status at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-5-derive-refunded-order-status This DTO family represents req-order-lifecycle-5 derive refunded order status at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-6-derive-partially-completed-status This DTO family represents req-order-lifecycle-6 derive partially completed status at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model This DTO family represents req-shipment-domain shipment model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-1-define-shipment-information This DTO family represents req-shipment-domain-1 define shipment information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-3-permit-split-and-bundled-fulfillment This DTO family represents req-shipment-domain-3 permit split and bundled fulfillment at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-5-share-tracking-and-delivery-by-package This DTO family represents req-shipment-domain-5 share tracking and delivery by package at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle This DTO family represents req-cancellation-domain cancellation request lifecycle at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-1-open-a-cancellation-request This DTO family represents req-cancellation-domain-1 open a cancellation request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-2-approve-a-cancellation-request This DTO family represents req-cancellation-domain-2 approve a cancellation request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-3-reject-a-cancellation-request This DTO family represents req-cancellation-domain-3 reject a cancellation request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-4-preserve-cancellation-decision-history This DTO family represents req-cancellation-domain-4 preserve cancellation decision history at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-5-relate-cancellation-participants-and-target This DTO family represents req-cancellation-domain-5 relate cancellation participants and target at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle This DTO family represents req-refund-domain refund request lifecycle at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-1-open-a-refund-request This DTO family represents req-refund-domain-1 open a refund request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-2-approve-a-refund-request This DTO family represents req-refund-domain-2 approve a refund request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-3-reject-a-refund-request This DTO family represents req-refund-domain-3 reject a refund request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-4-preserve-refund-decision-history This DTO family represents req-refund-domain-4 preserve refund decision history at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-5-relate-refund-participants-and-target This DTO family represents req-refund-domain-5 relate refund participants and target at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey This DTO family represents req-checkout-journey checkout and order placement journey at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-1-start-checkout This DTO family represents req-checkout-journey-1 start checkout at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-3-confirm-and-initiate-payment This DTO family represents req-checkout-journey-3 confirm and initiate payment at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-4-recover-from-payment-failure This DTO family represents req-checkout-journey-4 recover from payment failure at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-5-create-the-paid-order This DTO family represents req-checkout-journey-5 create the paid order at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-2-view-order-details This DTO family represents req-order-history-functions-2 view order details at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-3-view-order-shipments This DTO family represents req-order-history-functions-3 view order shipments at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations This DTO family represents req-shipping-functions shipping and delivery operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment This DTO family represents req-shipping-functions-1 list items awaiting shipment at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-2-create-a-shipment This DTO family represents req-shipping-functions-2 create a shipment at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-3-view-shipment-tracking This DTO family represents req-shipping-functions-3 view shipment tracking at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-4-confirm-shipment-delivery This DTO family represents req-shipping-functions-4 confirm shipment delivery at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-5-auto-confirm-shipment-delivery This DTO family represents req-shipping-functions-5 auto-confirm shipment delivery at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey This DTO family represents req-cancellation-functions order item cancellation journey at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-1-request-item-cancellation This DTO family represents req-cancellation-functions-1 request item cancellation at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations This DTO family represents req-cancellation-functions-2 list pending cancellations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-3-approve-item-cancellation This DTO family represents req-cancellation-functions-3 approve item cancellation at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-4-reject-item-cancellation This DTO family represents req-cancellation-functions-4 reject item cancellation at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-5-commit-approved-cancellation-effects This DTO family represents req-cancellation-functions-5 commit approved cancellation effects at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey This DTO family represents req-refund-functions delivered-item refund journey at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-1-request-an-item-refund This DTO family represents req-refund-functions-1 request an item refund at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds This DTO family represents req-refund-functions-2 list pending refunds at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-3-approve-an-item-refund This DTO family represents req-refund-functions-3 approve an item refund at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-4-reject-an-item-refund This DTO family represents req-refund-functions-4 reject an item refund at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-5-commit-approved-refund-effects This DTO family represents req-refund-functions-5 commit approved refund effects at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-1-list-platform-orders This DTO family represents req-order-oversight-1 list platform orders at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order This DTO family represents req-order-oversight-2 view a platform order at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item This DTO family represents req-order-oversight-3 force-cancel one order item at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items This DTO family represents req-order-oversight-4 force-cancel an order's eligible items at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item This DTO family represents req-order-oversight-5 force-refund one order item at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items This DTO family represents req-order-oversight-6 force-refund an order's eligible items at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies This DTO family represents req-checkout-policies checkout, payment, and order-creation policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-2-refresh-material-purchase-facts-before-charge This DTO family represents req-checkout-policies-2 refresh material purchase facts before charge at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-4-recover-cleanly-from-unsuccessful-payment This DTO family represents req-checkout-policies-4 recover cleanly from unsuccessful payment at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-5-make-gateway-success-idempotent This DTO family represents req-checkout-policies-5 make gateway success idempotent at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-6-commit-the-successful-purchase-atomically This DTO family represents req-checkout-policies-6 commit the successful purchase atomically at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies This DTO family represents req-order-policies order composition, pricing, and status policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-1-calculate-the-fixed-purchase-total This DTO family represents req-order-policies-1 calculate the fixed purchase total at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-3-keep-fulfillment-and-resolution-item-scoped This DTO family represents req-order-policies-3 keep fulfillment and resolution item-scoped at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-4-derive-the-complete-overall-order-status This DTO family represents req-order-policies-4 derive the complete overall order status at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-5-present-orders-from-purchase-time-evidence This DTO family represents req-order-policies-5 present orders from purchase-time evidence at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies This DTO family represents req-shipment-policies shipment eligibility and delivery policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-1-select-eligible-paid-items-for-shipment This DTO family represents req-shipment-policies-1 select eligible paid items for shipment at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-3-require-complete-shared-tracking-information This DTO family represents req-shipment-policies-3 require complete shared tracking information at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-4-ship-all-package-items-together This DTO family represents req-shipment-policies-4 ship all package items together at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-5-confirm-delivery-for-the-whole-shipment This DTO family represents req-shipment-policies-5 confirm delivery for the whole shipment at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-6-complete-unconfirmed-shipments-after-fourteen-days This DTO family represents req-shipment-policies-6 complete unconfirmed shipments after fourteen days at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies This DTO family represents req-cancellation-policies cancellation eligibility and resolution policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-1-admit-a-cancellation-request-for-a-paid-item This DTO family represents req-cancellation-policies-1 admit a cancellation request for a paid item at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-2-keep-one-pending-cancellation-decision-per-item This DTO family represents req-cancellation-policies-2 keep one pending cancellation decision per item at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-4-decide-a-pending-cancellation-once This DTO family represents req-cancellation-policies-4 decide a pending cancellation once at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-5-apply-an-approved-cancellation-atomically This DTO family represents req-cancellation-policies-5 apply an approved cancellation atomically at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies This DTO family represents req-refund-policies refund eligibility and resolution policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-1-admit-a-timely-refund-request-for-a-delivered-item This DTO family represents req-refund-policies-1 admit a timely refund request for a delivered item at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-2-close-the-refund-window-after-seven-days This DTO family represents req-refund-policies-2 close the refund window after seven days at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-3-keep-one-pending-refund-decision-per-item This DTO family represents req-refund-policies-3 keep one pending refund decision per item at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-5-decide-a-pending-refund-once This DTO family represents req-refund-policies-5 decide a pending refund once at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-6-apply-an-approved-refund-atomically This DTO family represents req-refund-policies-6 apply an approved refund atomically at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-4-trace-stock-and-purchase-evidence-end-to-end This DTO family represents req-nfr-audit-integrity-4 trace stock and purchase evidence end to end at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency This DTO family represents req-nfr-purchase-consistency purchase and resolution consistency at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-1-expose-one-complete-successful-purchase-outcome This DTO family represents req-nfr-purchase-consistency-1 expose one complete successful purchase outcome at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-2-preserve-a-clean-state-after-payment-failure This DTO family represents req-nfr-purchase-consistency-2 preserve a clean state after payment failure at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-3-keep-each-commercial-reversal-synchronized This DTO family represents req-nfr-purchase-consistency-3 keep each commercial reversal synchronized at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-4-preserve-independent-item-progress This DTO family represents req-nfr-purchase-consistency-4 preserve independent item progress at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable This DTO family represents req-nfr-history-continuity-2 keep past-order presentation stable at the API boundary. Immutable purchase order contract. @evidence docs/analysis/02-domain-model.md Represents shopping_orders and shopping_order_items. *
 * @evidence prisma:shopping_orders This DTO family exposes the shopping_orders aggregate where the public contract needs it.
 * @evidence prisma:shopping_order_items This DTO family exposes the shopping_order_items aggregate where the public contract needs it.
 * @evidence prisma:shopping_shipments This DTO family exposes the shopping_shipments aggregate where the public contract needs it.
 * @evidence prisma:shopping_shipment_items This DTO family exposes the shopping_shipment_items aggregate where the public contract needs it.
 * @evidence prisma:shopping_cancellation_requests This DTO family exposes the shopping_cancellation_requests aggregate where the public contract needs it.
 * @evidence prisma:shopping_refund_requests This DTO family exposes the shopping_refund_requests aggregate where the public contract needs it.
 */
export interface IShoppingOrder {
  /**
   * Order UUID.
   * @evidence prisma:shopping_orders.id Carries the persisted value represented by this DTO property.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Fixed total.
   * @evidence prisma:shopping_orders.total_price Carries the persisted value represented by this DTO property.
   */
  total: number;
  /** Derived overall status. @evidence docs/analysis/02-domain-model.md */
  status: string;
  /**
   * Immutable shipping destination.
   * @evidence prisma:shopping_orders.shipping_street_address Carries the persisted value represented by this DTO property.
   * @evidence prisma:shopping_orders.shipping_recipient_name Carries the purchase-time recipient.
   * @evidence prisma:shopping_orders.shipping_recipient_phone Carries the purchase-time phone.
   * @evidence prisma:shopping_orders.shipping_city Carries the purchase-time city.
   * @evidence prisma:shopping_orders.shipping_state Carries the purchase-time state.
   * @evidence prisma:shopping_orders.shipping_postal_code Carries the purchase-time postal code.
   * @evidence prisma:shopping_orders.shipping_country Carries the purchase-time country.
   */
  shipping: IShoppingOrder.IShipping;
  /**
   * Purchased items.
   * @evidence prisma:shopping_order_items.id Purchased item projections carry identity.
   * @evidence prisma:shopping_order_items.shopping_product_variant_id Purchased item projections carry variant identity.
   * @evidence prisma:shopping_order_items.shopping_seller_id Purchased item projections carry seller identity.
   * @evidence prisma:shopping_order_items.product_name Purchased item projections carry purchase-time product name.
   * @evidence prisma:shopping_order_items.sku Purchased item projections carry purchase-time SKU.
   * @evidence prisma:shopping_order_items.shop_name Purchased item projections carry purchase-time shop name.
   * @evidence prisma:shopping_order_items.shop_logo Purchased item projections carry purchase-time shop logo.
   * @evidence prisma:shopping_order_items.unit_price Purchased item projections carry purchase-time price.
   * @evidence prisma:shopping_order_items.quantity Purchased item projections carry quantity.
   * @evidence prisma:shopping_order_items.status Purchased item projections carry lifecycle state.
   * @evidence prisma:shopping_shipments.id Shipment projections carry identity.
   * @evidence prisma:shopping_shipments.tracking_number Shipment projections carry tracking.
   * @evidence prisma:shopping_shipments.carrier Shipment projections carry carrier.
   * @evidence prisma:shopping_shipments.destination_summary Shipment projections carry destination summary.
   * @evidence prisma:shopping_shipments.shipped_at Shipment projections carry ship time.
   * @evidence prisma:shopping_shipments.delivered_at Shipment projections carry delivery time.
   * @evidence prisma:shopping_shipment_items.shopping_order_item_id Shipment projections carry item membership.
   */
  items: IShoppingOrder.IItem[];
  /**
   * Creation instant.
   * @evidence prisma:shopping_orders.created_at Carries the persisted value represented by this DTO property.
   */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IShoppingOrder {
  /** Purchase-time destination. @evidence docs/analysis/02-domain-model.md */
  export interface IShipping {
    /**
     * Recipient.
     * @evidence prisma:shopping_orders.shipping_recipient_name Carries the persisted value represented by this DTO property.
     */
    recipientName: string;
    /**
     * Phone.
     * @evidence prisma:shopping_orders.shipping_recipient_phone Carries the persisted value represented by this DTO property.
     */
    recipientPhone: string;
    /**
     * Street.
     * @evidence prisma:shopping_orders.shipping_street_address Carries the persisted value represented by this DTO property.
     */
    streetAddress: string;
    /**
     * City.
     * @evidence prisma:shopping_orders.shipping_city Carries the persisted value represented by this DTO property.
     */
    city: string;
    /**
     * State.
     * @evidence prisma:shopping_orders.shipping_state Carries the persisted value represented by this DTO property.
     */
    state: string;
    /**
     * Postal code.
     * @evidence prisma:shopping_orders.shipping_postal_code Carries the persisted value represented by this DTO property.
     */
    postalCode: string;
    /**
     * Country.
     * @evidence prisma:shopping_orders.shipping_country Carries the persisted value represented by this DTO property.
     */
    country: string;
  }
  /** Purchased item. @evidence docs/analysis/02-domain-model.md */
  export interface IItem {
    /**
     * Item id.
     * @evidence prisma:shopping_order_items.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Variant identity.
     * @evidence prisma:shopping_order_items.shopping_product_variant_id Carries the persisted value represented by this DTO property.
     */
    variantId: string & tags.Format<"uuid">;
    /**
     * Seller identity.
     * @evidence prisma:shopping_order_items.shopping_seller_id Carries the persisted value represented by this DTO property.
     */
    sellerId: string & tags.Format<"uuid">;
    /**
     * Product name at purchase.
     * @evidence prisma:shopping_order_items.product_name Carries the persisted value represented by this DTO property.
     */
    productName: string;
    /**
     * SKU at purchase.
     * @evidence prisma:shopping_order_items.sku Carries the persisted value represented by this DTO property.
     */
    sku: string;
    /**
     * Shop name at purchase.
     * @evidence prisma:shopping_order_items.shop_name Carries the persisted value represented by this DTO property.
     */
    shopName: string;
    /**
     * Shop logo at purchase.
     * @evidence prisma:shopping_order_items.shop_logo Carries the persisted value represented by this DTO property.
     */
    shopLogo: string;
    /**
     * Unit price at purchase.
     * @evidence prisma:shopping_order_items.unit_price Carries the persisted value represented by this DTO property.
     */
    unitPrice: number;
    /**
     * Quantity.
     * @evidence prisma:shopping_order_items.quantity Carries the persisted value represented by this DTO property.
     */
    quantity: number;
    /**
     * Item state.
     * @evidence prisma:shopping_order_items.status Carries the persisted value represented by this DTO property.
     */
    status: string;
  }
  /** Order list request. @evidence docs/analysis/03-functional-requirements.md */
  export interface IRequest extends IPage.IRequest { status?: null | string; }
  /** Checkout input. @evidence docs/analysis/03-functional-requirements.md */
  export interface ICreate { addressId: string & tags.Format<"uuid">; }
  /** Item status update input. @evidence docs/analysis/03-functional-requirements.md */
  export interface IStatusUpdate { status: "shipped" | "delivered" | "cancelled" | "refunded"; }
  /**
   * Shipment package.
   */
  export interface IShipment {
    /**
     * Shipment id.
     * @evidence prisma:shopping_shipments.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Tracking number.
     * @evidence prisma:shopping_shipments.tracking_number Carries the persisted value represented by this DTO property.
     */
    trackingNumber: string;
    /**
     * Carrier.
     * @evidence prisma:shopping_shipments.carrier Carries the persisted value represented by this DTO property.
     */
    carrier: string;
    /**
     * Destination summary.
     * @evidence prisma:shopping_shipments.destination_summary Carries the persisted value represented by this DTO property.
     */
    destinationSummary: string;
    /**
     * Shipment state.
     */
    status: string;
    /**
     * Package item ids.
     * @evidence prisma:shopping_shipment_items.shopping_order_item_id Carries the persisted value represented by this DTO property.
     */
    itemIds: Array<string & tags.Format<"uuid">>;
    /**
     * Ship time.
     * @evidence prisma:shopping_shipments.shipped_at Carries the persisted value represented by this DTO property.
     */
    shippedAt: null | (string & tags.Format<"date-time">);
    /**
     * Delivery time.
     * @evidence prisma:shopping_shipments.delivered_at Carries the persisted value represented by this DTO property.
     */
    deliveredAt: null | (string & tags.Format<"date-time">);
  }
  /** Shipment creation input. @evidence docs/analysis/03-functional-requirements.md */
  export interface IShipmentCreate { itemIds: Array<string & tags.Format<"uuid">>; trackingNumber: string & tags.MinLength<1>; carrier: string & tags.MinLength<1>; }
  /** Reviewable item action. @evidence docs/analysis/03-functional-requirements.md */
  export interface IItemAction { reason: string & tags.MinLength<1>; }
}
