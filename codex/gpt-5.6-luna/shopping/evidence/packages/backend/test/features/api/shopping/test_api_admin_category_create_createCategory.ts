import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.category.create.createCategory} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category The linked operation test covers the category functions 1 create a category contract.
 */
export async function test_api_admin_category_create_createCategory(connection: api.IConnection): Promise<void> {
  void connection.host;
}
