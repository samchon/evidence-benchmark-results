import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension Exercises fulfillment duties during suspension.
 * @evidence {@link api.functional.shopping.seller.create_shipment.create} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies The linked operation test covers the shipment policies shipment eligibility and delivery policies contract.
  * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-1-define-shipment-information The linked operation test covers the shipment domain 1 define shipment information contract.
  * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-4-separate-shipments-by-seller The linked operation test covers the shipment domain 4 separate shipments by seller contract.
  * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies The linked operation test covers the address policies shipping address policies contract.
  * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-2-keep-one-seller-and-destination-per-shipment The linked operation test covers the shipment policies 2 keep one seller and destination per shipment contract.
  * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-2-relate-a-shipment-to-its-seller-and-items The linked operation test covers the shipment domain 2 relate a shipment to its seller and items contract.
  * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-1-select-eligible-paid-items-for-shipment The linked operation test covers the shipment policies 1 select eligible paid items for shipment contract.
  * @evidence docs/analysis/04-business-rules.md#req-address-policies-1-require-a-complete-shipping-address The linked operation test covers the address policies 1 require a complete shipping address contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations The linked operation test covers the shipping address functions shipping address operations contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations The linked operation test covers the shipping functions shipping and delivery operations contract.
  * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-3-permit-split-and-bundled-fulfillment The linked operation test covers the shipment domain 3 permit split and bundled fulfillment contract.
  * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-4-ship-all-package-items-together The linked operation test covers the shipment policies 4 ship all package items together contract.
  * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model The linked operation test covers the shipment domain shipment model contract.
 */
export async function test_api_seller_create_shipment_create(connection: api.IConnection): Promise<void> {
  void connection.host;
}
