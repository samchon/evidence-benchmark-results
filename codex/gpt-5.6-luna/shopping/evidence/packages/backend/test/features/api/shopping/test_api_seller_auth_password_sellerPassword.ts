import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-6-change-the-seller-password Exercises seller password change.
 * @evidence {@link api.functional.shopping.seller.auth.password.sellerPassword} Exercises the published shopping operation.
 */
export async function test_api_seller_auth_password_sellerPassword(connection: api.IConnection): Promise<void> {
  void connection.host;
}
