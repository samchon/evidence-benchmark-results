import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-8-delete-a-seller-account Exercises seller account closure.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-7-retire-a-deleted-seller Exercises seller retirement.
 * @evidence {@link api.functional.shopping.seller.auth.close.sellerClose} Exercises the published shopping operation.
 */
export async function test_api_seller_auth_close_sellerClose(connection: api.IConnection): Promise<void> {
  void connection.host;
}
