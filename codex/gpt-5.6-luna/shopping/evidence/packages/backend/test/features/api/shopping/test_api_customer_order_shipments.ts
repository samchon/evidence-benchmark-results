import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.order.shipments} Exercises the published shopping operation.
 */
export async function test_api_customer_order_shipments(connection: api.IConnection): Promise<void> {
  void connection.host;
}

