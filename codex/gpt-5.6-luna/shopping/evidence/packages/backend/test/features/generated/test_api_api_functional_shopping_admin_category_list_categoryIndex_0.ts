import * as api from "@benchmark/shopping-api";
import typia from "typia";
import { TestValidator } from "@nestia/e2e";

/**
 * Exercises the generated category-list accessor's unauthenticated refusal.
 *
 * @evidence {@link api.functional.shopping.admin.category.list.categoryIndex} Exercises the generated operation accessor.
 * @evidenceReview {@link api.functional.shopping.admin.category.list.categoryIndex} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the refusal is asserted.
 * @param connection Base connection supplied by the test runner.
 */
export async function test_api_api_functional_shopping_admin_category_list_categoryIndex_0(connection: api.IConnection): Promise<void> {
  await TestValidator.error("unauthenticated operation", async () => api.functional.shopping.admin.category.list.categoryIndex(
    connection,
    typia.random<Parameters<typeof api.functional.shopping.admin.category.list.categoryIndex>[1]>(),
  ));
}
