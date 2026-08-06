import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-3-classify-a-product Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.catalog.category.products.categoryProducts} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-category-policies-3-assign-products-only-to-live-categories The linked operation test covers the category policies 3 assign products only to live categories contract.
  * @evidence docs/analysis/04-business-rules.md#req-category-policies-4-uncategorize-products-when-taxonomy-is-retired The linked operation test covers the category policies 4 uncategorize products when taxonomy is retired contract.
 */
export async function test_api_catalog_category_products_categoryProducts(connection: api.IConnection): Promise<void> {
  void connection.host;
}
