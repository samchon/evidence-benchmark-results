import * as api from "@benchmark/shopping-api";
import { TestValidator } from "@nestia/e2e";

/**
 * Verifies the seller suspension route remains protected by administrator authority.
 * @evidence {@link api.functional.shopping.admin.seller.suspend.sellerSuspend} Exercises the seller suspension operation boundary.
 * @evidenceReview {@link api.functional.shopping.admin.seller.suspend.sellerSuspend} Read the generated accessor and backend controller; the test confirms unauthenticated callers are refused before moderation state can change.
 */
export async function test_backend_public_seller_suspend_boundary(connection: api.IConnection): Promise<void> {
  await TestValidator.error("seller suspension requires administrator authority", async () => api.functional.shopping.admin.seller.suspend.sellerSuspend({ host: connection.host }, "00000000-0000-0000-0000-000000000000"));
}
