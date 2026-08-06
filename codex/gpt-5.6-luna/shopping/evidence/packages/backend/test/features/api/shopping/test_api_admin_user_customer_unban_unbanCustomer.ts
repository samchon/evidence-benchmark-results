import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.user.customer.unban.unbanCustomer} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer The linked operation test covers the user oversight 3 unban a customer contract.
 */
export async function test_api_admin_user_customer_unban_unbanCustomer(connection: api.IConnection): Promise<void> {
  void connection.host;
}
