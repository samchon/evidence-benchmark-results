import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Exercises the generated accessor surface for this backend operation.
 * @param connection Base connection supplied by the test runner.
 * @evidence {@link api.functional.shopping.auth.customer.login.customerLogin} Exercises the generated operation accessor.
 * @evidenceReview {@link api.functional.shopping.auth.customer.login.customerLogin} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_auth_customer_login_customerLogin_23(connection: api.IConnection): Promise<void> {
  const email = `customer-login-${Date.now()}@example.com`;
  await api.functional.shopping.auth.customer.join.customerJoin(connection, { email, password: "correct-horse-battery-staple" });
  const result = await api.functional.shopping.auth.customer.login.customerLogin(connection, { email, password: "correct-horse-battery-staple" });
  typia.assert(result);
}
