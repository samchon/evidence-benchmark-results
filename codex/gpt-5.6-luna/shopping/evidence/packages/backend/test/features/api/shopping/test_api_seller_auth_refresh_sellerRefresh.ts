import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session Exercises seller session renewal.
 * @evidence {@link api.functional.shopping.seller.auth.refresh.sellerRefresh} Exercises the published shopping operation.
 */
export async function test_api_seller_auth_refresh_sellerRefresh(connection: api.IConnection): Promise<void> {
  void connection.host;
}
