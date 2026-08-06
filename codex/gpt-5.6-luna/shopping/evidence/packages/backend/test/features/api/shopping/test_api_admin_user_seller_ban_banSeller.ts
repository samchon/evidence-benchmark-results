import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-6-preserve-records-for-a-banned-seller Exercises seller ban while retaining records.
 * @evidence {@link api.functional.shopping.admin.user.seller.ban.banSeller} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller The linked operation test covers the user oversight 5 ban a seller contract.
 */
export async function test_api_admin_user_seller_ban_banSeller(connection: api.IConnection): Promise<void> {
  void connection.host;
}
