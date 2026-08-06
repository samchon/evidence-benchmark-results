import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.seller.awaiting_shipment.awaiting} Exercises the published shopping operation.
 */
export async function test_api_seller_awaiting_shipment_awaiting(connection: api.IConnection): Promise<void> {
  void connection.host;
}
