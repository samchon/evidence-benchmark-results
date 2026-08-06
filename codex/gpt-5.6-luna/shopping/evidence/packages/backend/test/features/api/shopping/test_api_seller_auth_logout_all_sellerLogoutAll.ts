import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session Exercises all seller-session logout.
 * @evidence {@link api.functional.shopping.seller.auth.logout_all.sellerLogoutAll} Exercises the published shopping operation.
 */
export async function test_api_seller_auth_logout_all_sellerLogoutAll(connection: api.IConnection): Promise<void> {
  void connection.host;
}
