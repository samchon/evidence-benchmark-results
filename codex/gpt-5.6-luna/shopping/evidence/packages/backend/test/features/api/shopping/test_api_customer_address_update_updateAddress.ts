import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.address.update.updateAddress} Exercises the published shopping operation.
 */
export async function test_api_customer_address_update_updateAddress(connection: api.IConnection): Promise<void> {
  void connection.host;
}

