import * as api from "@benchmark/shopping-api";
import typia from "typia";
import { TestValidator } from "@nestia/e2e";

/**
 * Exercises the generated accessor surface for this backend operation.
 * @param connection Base connection supplied by the test runner.
 * @evidence {@link api.functional.shopping.admin.request.list.requestIndex} Exercises the generated operation accessor.
 * @evidenceReview {@link api.functional.shopping.admin.request.list.requestIndex} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_admin_request_list_requestIndex_16(connection: api.IConnection): Promise<void> {
  await TestValidator.error("unauthenticated operation", async () => api.functional.shopping.admin.request.list.requestIndex(
    connection,
    typia.random<Parameters<typeof api.functional.shopping.admin.request.list.requestIndex>[1]>(),
  ));
}
