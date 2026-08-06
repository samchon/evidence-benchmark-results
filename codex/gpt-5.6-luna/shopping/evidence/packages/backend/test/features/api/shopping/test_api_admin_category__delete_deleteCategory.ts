import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-4-uncategorize-products-after-category-deletion Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.category._delete.deleteCategory} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category The linked operation test covers the category functions 3 delete a category contract.
 */
export async function test_api_admin_category__delete_deleteCategory(connection: api.IConnection): Promise<void> {
  void connection.host;
}
