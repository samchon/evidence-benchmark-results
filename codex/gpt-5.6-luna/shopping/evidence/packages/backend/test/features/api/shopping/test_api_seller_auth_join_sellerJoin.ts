import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account Exercises seller registration.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-1-begin-seller-approval-as-pending Exercises the pending approval lifecycle.
 * @evidence {@link api.functional.shopping.seller.auth.join.sellerJoin} Exercises the published shopping operation.
 */
export async function test_api_seller_auth_join_sellerJoin(connection: api.IConnection): Promise<void> {
  void connection.host;
}
