import * as api from "@benchmark/shopping-api";
import typia from "typia";

/** Proves the seller credential recovery path preserves the seller identity. */
export async function test_api_seller_recovery(connection: api.IConnection): Promise<void> {
  const email = `seller-recovery-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  await api.functional.shopping.auth.seller.join.sellerJoin(connection, { email, password: "password-123" });
  const challenge = await api.functional.shopping.auth.seller.recovery.sellerRecoveryRequest(connection, { email });
  typia.assert(challenge);
  const completed = await api.functional.shopping.auth.seller.recovery.sellerRecoveryComplete(connection, { token: challenge.token, newPassword: "password-789" });
  typia.assert(completed);
  const authorized = await api.functional.shopping.auth.seller.login.sellerLogin(connection, { email, password: "password-789" });
  typia.assert(authorized);
}
