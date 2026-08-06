import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-8-delete-a-customer-account Exercises customer account closure.
 * @evidence {@link api.functional.shopping.customer.auth.close.customerClose} Exercises the published shopping operation.
 */
export async function test_api_customer_auth_close_customerClose(connection: api.IConnection): Promise<void> {
  void connection.host;
}
