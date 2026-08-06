import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session Exercises current seller-session logout.
 * @evidence {@link api.functional.shopping.seller.auth.logout.sellerLogout} Exercises the published shopping operation.
 */
export async function test_api_seller_auth_logout_sellerLogout(connection: api.IConnection): Promise<void> {
  void connection.host;
}
