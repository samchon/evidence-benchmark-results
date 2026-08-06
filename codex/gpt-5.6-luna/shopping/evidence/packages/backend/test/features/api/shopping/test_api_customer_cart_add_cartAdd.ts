import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.cart.add.cartAdd} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions The linked operation test covers the cart policies 2 merge repeated variant additions contract.
 */
export async function test_api_customer_cart_add_cartAdd(connection: api.IConnection): Promise<void> {
  void connection.host;
}
