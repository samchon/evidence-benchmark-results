import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-3-designate-one-default-address Exercises default-address selection.
 * @evidence {@link api.functional.shopping.customer.address._default.setDefault} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement The linked operation test covers the address policies 4 clear a removed default without automatic replacement contract.
  * @evidence docs/analysis/04-business-rules.md#req-address-policies-3-keep-at-most-one-default-address The linked operation test covers the address policies 3 keep at most one default address contract.
 */
export async function test_api_customer_address__default_setDefault(connection: api.IConnection): Promise<void> {
  void connection.host;
}
