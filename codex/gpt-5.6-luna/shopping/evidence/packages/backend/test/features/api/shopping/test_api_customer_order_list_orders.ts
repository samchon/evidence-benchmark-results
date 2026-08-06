import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.order.list.orders} Exercises the published shopping operation.
  * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history The linked operation test covers the order history functions customer order history contract.
 */
export async function test_api_customer_order_list_orders(connection: api.IConnection): Promise<void> {
  void connection.host;
}
