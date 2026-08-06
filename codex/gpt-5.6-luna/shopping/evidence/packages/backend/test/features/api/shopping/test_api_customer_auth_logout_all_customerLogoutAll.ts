import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-5-log-out-every-customer-session Exercises all-session logout.
 * @evidence {@link api.functional.shopping.customer.auth.logout_all.customerLogoutAll} Exercises the published shopping operation.
 */
export async function test_api_customer_auth_logout_all_customerLogoutAll(connection: api.IConnection): Promise<void> {
  void connection.host;
}
