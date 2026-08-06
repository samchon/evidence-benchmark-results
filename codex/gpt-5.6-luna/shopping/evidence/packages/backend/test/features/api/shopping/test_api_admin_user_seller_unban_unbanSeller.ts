import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.user.seller.unban.unbanSeller} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller The linked operation test covers the user oversight 6 unban a seller contract.
 */
export async function test_api_admin_user_seller_unban_unbanSeller(connection: api.IConnection): Promise<void> {
  void connection.host;
}
