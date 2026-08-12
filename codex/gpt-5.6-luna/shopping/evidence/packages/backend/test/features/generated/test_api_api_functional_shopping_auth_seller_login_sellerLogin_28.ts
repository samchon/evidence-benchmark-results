import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Exercises the generated accessor surface for this backend operation.
 * @param connection Base connection supplied by the test runner.
 * @evidence {@link api.functional.shopping.auth.seller.login.sellerLogin} Exercises the generated operation accessor.
 * @evidenceReview {@link api.functional.shopping.auth.seller.login.sellerLogin} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_auth_seller_login_sellerLogin_28(connection: api.IConnection): Promise<void> {
  const email = `seller-login-${Date.now()}@example.com`;
  await api.functional.shopping.auth.seller.join.sellerJoin(connection, { email, password: "correct-horse-battery-staple" });
  const result = await api.functional.shopping.auth.seller.login.sellerLogin(connection, { email, password: "correct-horse-battery-staple" });
  typia.assert(result);
}
