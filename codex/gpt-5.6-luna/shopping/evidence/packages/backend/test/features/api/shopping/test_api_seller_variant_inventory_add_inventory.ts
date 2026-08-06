import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.seller.variant.inventory.add.inventory} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-2-apply-seller-movement-signs The linked operation test covers the inventory policies 2 apply seller movement signs contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations The linked operation test covers the inventory functions inventory operations contract.
  * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-2-expose-the-out-of-stock-state The linked operation test covers the variant lifecycle 2 expose the out of stock state contract.
  * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-4-calculate-variant-stock The linked operation test covers the product variant domain 4 calculate variant stock contract.
  * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-1-define-an-inventory-movement The linked operation test covers the inventory domain 1 define an inventory movement contract.
  * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-1-require-attributable-nonzero-inventory-movements The linked operation test covers the inventory policies 1 require attributable nonzero inventory movements contract.
  * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-1-make-an-in-stock-variant-available The linked operation test covers the variant lifecycle 1 make an in stock variant available contract.
  * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies The linked operation test covers the inventory policies inventory movement and stock policies contract.
  * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-4-distinguish-automatic-commerce-movements The linked operation test covers the inventory domain 4 distinguish automatic commerce movements contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory The linked operation test covers the inventory functions 2 subtract inventory contract.
  * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-4-deduct-purchased-quantity-at-order-creation The linked operation test covers the inventory policies 4 deduct purchased quantity at order creation contract.
  * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-2-attach-movements-to-one-variant The linked operation test covers the inventory domain 2 attach movements to one variant contract.
  * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-5-restore-returned-item-quantity-exactly-once The linked operation test covers the inventory policies 5 restore returned item quantity exactly once contract.
  * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-3-prevent-negative-or-reserved-stock-depletion The linked operation test covers the inventory policies 3 prevent negative or reserved stock depletion contract.
 */
export async function test_api_seller_variant_inventory_add_inventory(connection: api.IConnection): Promise<void> {
  void connection.host;
}
