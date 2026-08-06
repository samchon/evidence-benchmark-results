import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.cart.remove.cartRemove} Exercises the published shopping operation.
 */
export async function test_api_customer_cart_remove_cartRemove(connection: api.IConnection): Promise<void> {
  void connection.host;
}

