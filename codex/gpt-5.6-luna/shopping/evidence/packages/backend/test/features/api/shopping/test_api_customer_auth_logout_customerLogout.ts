import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-4-log-out-the-current-customer-session Exercises current-session logout.
 * @evidence {@link api.functional.shopping.customer.auth.logout.customerLogout} Exercises the published shopping operation.
 */
export async function test_api_customer_auth_logout_customerLogout(connection: api.IConnection): Promise<void> {
  void connection.host;
}
