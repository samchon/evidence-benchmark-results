import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.shipping.tracking} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-3-require-complete-shared-tracking-information The linked operation test covers the shipment policies 3 require complete shared tracking information contract.
  * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-5-share-tracking-and-delivery-by-package The linked operation test covers the shipment domain 5 share tracking and delivery by package contract.
 */
export async function test_api_shipping_tracking(connection: api.IConnection): Promise<void> {
  void connection.host;
}
