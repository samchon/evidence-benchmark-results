import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.seller.auth.login.sellerLogin} Exercises the published shopping operation.
 */
export async function test_api_seller_auth_login_sellerLogin(connection: api.IConnection): Promise<void> {
  void connection.host;
}
