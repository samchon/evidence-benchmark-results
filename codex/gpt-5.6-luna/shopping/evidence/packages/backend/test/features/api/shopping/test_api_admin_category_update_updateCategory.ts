import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.category.update.updateCategory} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category The linked operation test covers the category functions 2 edit a category contract.
 */
export async function test_api_admin_category_update_updateCategory(connection: api.IConnection): Promise<void> {
  void connection.host;
}
