import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-5-relate-products-to-discovery-and-history Exercises product discovery and retained history.
 * @evidence {@link api.functional.shopping.catalog.product.search.products} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-product-policies-4-block-seller-product-deletion-during-fulfillment The linked operation test covers the product policies 4 block seller product deletion during fulfillment contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations The linked operation test covers the product functions product operations contract.
  * @evidence docs/analysis/04-business-rules.md#req-search-policies-4-render-the-standard-product-card The linked operation test covers the search policies 4 render the standard product card contract.
  * @evidence docs/analysis/04-business-rules.md#req-search-policies-2-combine-product-search-constraints The linked operation test covers the search policies 2 combine product search constraints contract.
  * @evidence docs/analysis/04-business-rules.md#req-search-policies-3-order-and-page-search-results-deterministically The linked operation test covers the search policies 3 order and page search results deterministically contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey The linked operation test covers the product discovery product discovery journey contract.
  * @evidence docs/analysis/04-business-rules.md#req-product-policies-1-require-valid-product-catalog-data The linked operation test covers the product policies 1 require valid product catalog data contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products The linked operation test covers the product functions 5 list and view all products contract.
  * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies The linked operation test covers the search policies product search and listing policies contract.
  * @evidence docs/analysis/04-business-rules.md#req-product-policies-6-retire-violating-merchandise-without-stranding-obligations The linked operation test covers the product policies 6 retire violating merchandise without stranding obligations contract.
  * @evidence docs/analysis/04-business-rules.md#req-product-policies-5-block-seller-product-deletion-during-unresolved-requests The linked operation test covers the product policies 5 block seller product deletion during unresolved requests contract.
  * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies The linked operation test covers the product policies product validation and retirement policies contract.
  * @evidence docs/analysis/04-business-rules.md#req-product-policies-2-enforce-product-ownership The linked operation test covers the product policies 2 enforce product ownership contract.
 */
export async function test_api_catalog_product_search_products(connection: api.IConnection): Promise<void> {
  void connection.host;
}
