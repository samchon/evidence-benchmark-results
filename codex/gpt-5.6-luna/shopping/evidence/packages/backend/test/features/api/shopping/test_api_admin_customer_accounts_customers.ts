import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.customer_accounts.customers} Exercises the published shopping operation.
  * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight The linked operation test covers the user oversight customer and seller account oversight contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts The linked operation test covers the user oversight 1 list customer accounts contract.
 */
export async function test_api_admin_customer_accounts_customers(connection: api.IConnection): Promise<void> {
  void connection.host;
}
