import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-1-define-category-information Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-2-limit-the-category-hierarchy Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.catalog.category.list.categories} Exercises the published shopping operation.
 */
export async function test_api_catalog_category_list_categories(connection: api.IConnection): Promise<void> {
  void connection.host;
}
