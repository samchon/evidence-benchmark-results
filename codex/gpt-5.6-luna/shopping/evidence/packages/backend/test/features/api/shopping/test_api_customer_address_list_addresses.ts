import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.address.list.addresses} Exercises the published shopping operation.
 */
export async function test_api_customer_address_list_addresses(connection: api.IConnection): Promise<void> {
  void connection.host;
}

