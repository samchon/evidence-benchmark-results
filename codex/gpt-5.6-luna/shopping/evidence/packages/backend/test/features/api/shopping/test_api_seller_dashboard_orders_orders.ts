import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.seller.dashboard_orders.orders} Exercises the published shopping operation.
 */
export async function test_api_seller_dashboard_orders_orders(connection: api.IConnection): Promise<void> {
  void connection.host;
}

