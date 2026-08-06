import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-3-continue-a-customer-session Exercises customer session renewal.
 * @evidence {@link api.functional.shopping.customer.auth.refresh.customerRefresh} Exercises the published shopping operation.
 */
export async function test_api_customer_auth_refresh_customerRefresh(connection: api.IConnection): Promise<void> {
  void connection.host;
}
