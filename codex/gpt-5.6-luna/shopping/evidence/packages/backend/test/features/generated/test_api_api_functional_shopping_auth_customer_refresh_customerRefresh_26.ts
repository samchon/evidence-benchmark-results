import * as api from "@benchmark/shopping-api";
import typia from "typia";
import { TestValidator } from "@nestia/e2e";

/**
 * Exercises the generated accessor surface for this backend operation.
 * @param connection Base connection supplied by the test runner.
 * @evidence {@link api.functional.shopping.auth.customer.refresh.customerRefresh} Exercises the generated operation accessor.
 * @evidenceReview {@link api.functional.shopping.auth.customer.refresh.customerRefresh} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_auth_customer_refresh_customerRefresh_26(connection: api.IConnection): Promise<void> {
  await TestValidator.error("unauthenticated operation", async () => api.functional.shopping.auth.customer.refresh.customerRefresh(
    connection,
    typia.random<Parameters<typeof api.functional.shopping.auth.customer.refresh.customerRefresh>[1]>(),
  ));
}
