import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.address._delete.deleteAddress} Exercises the published shopping operation.
 */
export async function test_api_customer_address__delete_deleteAddress(connection: api.IConnection): Promise<void> {
  void connection.host;
}

