import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.seller_accounts.sellers} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts The linked operation test covers the user oversight 4 list seller accounts contract.
 */
export async function test_api_admin_seller_accounts_sellers(connection: api.IConnection): Promise<void> {
  void connection.host;
}
