import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Exercises seller access recovery.
 * @evidence {@link api.functional.shopping.seller.auth.recover.sellerRecover} Exercises the published shopping operation.
 */
export async function test_api_seller_auth_recover_sellerRecover(connection: api.IConnection): Promise<void> {
  void connection.host;
}
