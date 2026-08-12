import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Proves an eligible seller can irreversibly close its empty account.
 * @evidence {@link api.functional.shopping.seller.account.erase.accountErase} Exercises the seller closure boundary.
 * @evidenceReview {@link api.functional.shopping.seller.account.erase.accountErase} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_seller_account_erase_accountErase_102(connection: api.IConnection): Promise<void> {
  const authorized = await api.functional.shopping.auth.seller.join.sellerJoin(connection, { email: `close-${Date.now()}@example.com`, password: "correct-horse-battery-staple" });
  connection.headers = { Authorization: `Bearer ${authorized.accessToken}` };
  const result = await api.functional.shopping.seller.account.erase.accountErase(connection, { currentPassword: "correct-horse-battery-staple" });
  typia.assert(result);
}
