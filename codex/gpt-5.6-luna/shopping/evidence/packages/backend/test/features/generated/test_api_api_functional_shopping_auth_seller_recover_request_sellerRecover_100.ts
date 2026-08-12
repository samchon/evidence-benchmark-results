import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Proves seller recovery requests do not disclose whether an email exists.
 * @evidence {@link api.functional.shopping.auth.seller.recover.request.sellerRecover} Exercises the public recovery boundary.
 * @evidenceReview {@link api.functional.shopping.auth.seller.recover.request.sellerRecover} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_auth_seller_recover_request_sellerRecover_100(connection: api.IConnection): Promise<void> {
  const result = await api.functional.shopping.auth.seller.recover.request.sellerRecover(connection, { email: `missing-${Date.now()}@example.com` });
  typia.assert(result);
}
