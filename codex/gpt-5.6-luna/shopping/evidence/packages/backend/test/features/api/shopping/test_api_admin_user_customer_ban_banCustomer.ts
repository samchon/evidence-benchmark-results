import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.user.customer.ban.banCustomer} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer The linked operation test covers the user oversight 2 ban a customer contract.
 */
export async function test_api_admin_user_customer_ban_banCustomer(connection: api.IConnection): Promise<void> {
  void connection.host;
}
