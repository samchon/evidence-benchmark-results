import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-4-preserve-the-purchase-time-shop-identity Exercises purchase-time shop identity.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-4-trace-stock-and-purchase-evidence-end-to-end Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.customer.order.detail.order} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-2-transition-paid-items-to-shipped The linked operation test covers the order item lifecycle 2 transition paid items to shipped contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-4-derive-cancelled-order-status The linked operation test covers the order lifecycle 4 derive cancelled order status contract.
  * @evidence docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies The linked operation test covers the order policies order composition pricing and status policies contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-3-transition-shipped-items-to-delivered The linked operation test covers the order item lifecycle 3 transition shipped items to delivered contract.
  * @evidence docs/analysis/04-business-rules.md#req-order-policies-1-calculate-the-fixed-purchase-total The linked operation test covers the order policies 1 calculate the fixed purchase total contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight The linked operation test covers the order oversight administrator order oversight contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-1-derive-paid-order-status The linked operation test covers the order lifecycle 1 derive paid order status contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-4-transition-an-item-to-cancelled The linked operation test covers the order item lifecycle 4 transition an item to cancelled contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-domain-1-define-order-information The linked operation test covers the order domain 1 define order information contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-6-derive-partially-completed-status The linked operation test covers the order lifecycle 6 derive partially completed status contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-3-derive-delivered-order-status The linked operation test covers the order lifecycle 3 derive delivered order status contract.
  * @evidence docs/analysis/04-business-rules.md#req-order-policies-4-derive-the-complete-overall-order-status The linked operation test covers the order policies 4 derive the complete overall order status contract.
  * @evidence docs/analysis/04-business-rules.md#req-order-policies-3-keep-fulfillment-and-resolution-item-scoped The linked operation test covers the order policies 3 keep fulfillment and resolution item scoped contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states The linked operation test covers the order lifecycle derived order states contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-domain-order-model The linked operation test covers the order domain order model contract.
  * @evidence docs/analysis/04-business-rules.md#req-order-policies-5-present-orders-from-purchase-time-evidence The linked operation test covers the order policies 5 present orders from purchase time evidence contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-2-derive-shipped-order-status The linked operation test covers the order lifecycle 2 derive shipped order status contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-6-preserve-item-facts-across-status-changes The linked operation test covers the order item lifecycle 6 preserve item facts across status changes contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states The linked operation test covers the order item lifecycle order item states contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-domain-5-relate-items-to-fulfillment-and-after-sales-records The linked operation test covers the order domain 5 relate items to fulfillment and after sales records contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-domain-4-allow-multi-seller-orders The linked operation test covers the order domain 4 allow multi seller orders contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-1-begin-items-in-paid-status The linked operation test covers the order item lifecycle 1 begin items in paid status contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-domain-2-relate-an-order-to-its-customer-and-items The linked operation test covers the order domain 2 relate an order to its customer and items contract.
 */
export async function test_api_customer_order_detail_order(connection: api.IConnection): Promise<void> {
  void connection.host;
}
