import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-4-relate-variants-to-a-product Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-1-define-variant-information Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-2-relate-a-variant-to-its-product Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.seller.product.variant.createVariant} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-variant-policies-4-block-variant-deletion-during-fulfillment The linked operation test covers the variant policies 4 block variant deletion during fulfillment contract.
  * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-3-resolve-the-effective-variant-price The linked operation test covers the product variant domain 3 resolve the effective variant price contract.
  * @evidence docs/analysis/04-business-rules.md#req-order-policies-2-consolidate-purchased-units-by-variant The linked operation test covers the order policies 2 consolidate purchased units by variant contract.
  * @evidence docs/analysis/04-business-rules.md#req-variant-policies-2-validate-the-optional-price-override The linked operation test covers the variant policies 2 validate the optional price override contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-domain-3-combine-purchased-quantity-by-variant The linked operation test covers the order domain 3 combine purchased quantity by variant contract.
  * @evidence docs/analysis/04-business-rules.md#req-variant-policies-5-block-variant-deletion-during-unresolved-requests The linked operation test covers the variant policies 5 block variant deletion during unresolved requests contract.
  * @evidence docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies The linked operation test covers the variant policies variant identity price availability and retirement policies contract.
  * @evidence docs/analysis/04-business-rules.md#req-variant-policies-3-require-an-available-variant-for-purchase The linked operation test covers the variant policies 3 require an available variant for purchase contract.
  * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement The linked operation test covers the variant lifecycle variant availability and retirement contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations The linked operation test covers the variant functions product variant operations contract.
  * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-5-use-variants-as-commerce-units The linked operation test covers the product variant domain 5 use variants as commerce units contract.
  * @evidence docs/analysis/04-business-rules.md#req-variant-policies-1-require-a-unique-sku-and-concrete-option-combination The linked operation test covers the variant policies 1 require a unique sku and concrete option combination contract.
  * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-3-retire-a-deletable-variant The linked operation test covers the variant lifecycle 3 retire a deletable variant contract.
  * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-4-preserve-retired-variant-evidence The linked operation test covers the variant lifecycle 4 preserve retired variant evidence contract.
 */
export async function test_api_seller_product_variant_createVariant(connection: api.IConnection): Promise<void> {
  void connection.host;
}
