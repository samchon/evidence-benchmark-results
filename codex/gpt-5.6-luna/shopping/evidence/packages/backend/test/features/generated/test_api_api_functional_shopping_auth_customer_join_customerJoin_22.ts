import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Exercises the generated accessor surface for this backend operation.
 * @param connection Base connection supplied by the test runner.
 * @evidence {@link api.functional.shopping.auth.customer.join.customerJoin} Exercises the generated operation accessor.
 * @evidenceReview {@link api.functional.shopping.auth.customer.join.customerJoin} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_auth_customer_join_customerJoin_22(connection: api.IConnection): Promise<void> {
  const value = await api.functional.shopping.auth.customer.join.customerJoin(connection, { email: `customer-${Date.now()}@example.com`, password: "correct-horse-battery-staple" });
  typia.assert(value);
}
