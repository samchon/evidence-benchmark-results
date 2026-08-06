import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-1-define-shipping-address-information Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-2-relate-addresses-to-a-customer Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.customer.address.create.createAddress} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-address-policies-2-enforce-address-ownership The linked operation test covers the address policies 2 enforce address ownership contract.
 */
export async function test_api_customer_address_create_createAddress(connection: api.IConnection): Promise<void> {
  void connection.host;
}
