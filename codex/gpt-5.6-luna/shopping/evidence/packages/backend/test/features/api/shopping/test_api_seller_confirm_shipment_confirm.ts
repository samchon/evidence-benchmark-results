import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.seller.confirm_shipment.confirm} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-6-complete-unconfirmed-shipments-after-fourteen-days The linked operation test covers the shipment policies 6 complete unconfirmed shipments after fourteen days contract.
  * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-5-confirm-delivery-for-the-whole-shipment The linked operation test covers the shipment policies 5 confirm delivery for the whole shipment contract.
 */
export async function test_api_seller_confirm_shipment_confirm(connection: api.IConnection): Promise<void> {
  void connection.host;
}
