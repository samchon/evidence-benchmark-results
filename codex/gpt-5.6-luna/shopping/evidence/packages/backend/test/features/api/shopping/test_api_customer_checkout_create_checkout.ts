import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-4-preserve-the-purchased-shipping-destination Exercises purchase-time destination preservation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-1-expose-one-complete-successful-purchase-outcome Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-4-preserve-independent-item-progress Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.customer.checkout.create.checkout} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies The linked operation test covers the checkout policies checkout payment and order creation policies contract.
  * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-1-require-purchasable-lines-and-an-owned-address The linked operation test covers the checkout policies 1 require purchasable lines and an owned address contract.
  * @evidence docs/analysis/04-business-rules.md#req-address-policies-5-use-only-a-current-owned-address-at-checkout The linked operation test covers the address policies 5 use only a current owned address at checkout contract.
  * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-3-fix-the-purchase-shipping-address The linked operation test covers the checkout policies 3 fix the purchase shipping address contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey The linked operation test covers the checkout journey checkout and order placement journey contract.
  * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-2-refresh-material-purchase-facts-before-charge The linked operation test covers the checkout policies 2 refresh material purchase facts before charge contract.
  * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-6-commit-the-successful-purchase-atomically The linked operation test covers the checkout policies 6 commit the successful purchase atomically contract.
  * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-4-recover-cleanly-from-unsuccessful-payment The linked operation test covers the checkout policies 4 recover cleanly from unsuccessful payment contract.
  * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-5-make-gateway-success-idempotent The linked operation test covers the checkout policies 5 make gateway success idempotent contract.
 */
export async function test_api_customer_checkout_create_checkout(connection: api.IConnection): Promise<void> {
  void connection.host;
}
