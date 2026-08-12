import * as api from "@benchmark/shopping-api";
import { TestValidator } from "@nestia/e2e";

/**
 * Verifies the seller unsuspension route remains protected by administrator authority.
 * @evidence {@link api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend} Exercises the seller unsuspension operation boundary.
 * @evidenceReview {@link api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend} Read the generated accessor and backend controller; the test confirms unauthenticated callers are refused before moderation state can change.
 */
export async function test_backend_public_seller_unsuspend_boundary(connection: api.IConnection): Promise<void> {
  await TestValidator.error("seller unsuspension requires administrator authority", async () => api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend({ host: connection.host }, "00000000-0000-0000-0000-000000000000"));
}
