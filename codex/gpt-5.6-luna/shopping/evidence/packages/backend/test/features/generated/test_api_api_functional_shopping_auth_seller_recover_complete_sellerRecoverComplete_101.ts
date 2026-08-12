import * as api from "@benchmark/shopping-api";
import { TestValidator } from "@nestia/e2e";

/**
 * Proves an invalid seller recovery challenge is refused.
 * @evidence {@link api.functional.shopping.auth.seller.recover.complete.sellerRecoverComplete} Exercises challenge validation.
 * @evidenceReview {@link api.functional.shopping.auth.seller.recover.complete.sellerRecoverComplete} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_auth_seller_recover_complete_sellerRecoverComplete_101(connection: api.IConnection): Promise<void> {
  await TestValidator.error("invalid seller recovery challenge", async () => api.functional.shopping.auth.seller.recover.complete.sellerRecoverComplete(connection, { challenge: "invalid-challenge", newPassword: "correct-horse-battery-staple" }));
}
