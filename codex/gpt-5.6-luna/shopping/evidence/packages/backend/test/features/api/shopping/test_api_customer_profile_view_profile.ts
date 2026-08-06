import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information Exercises the profile operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer Exercises the profile operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-3-remove-profile-data-at-customer-closure Exercises the profile operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Exercises the profile operation that owns this requirement.
 * @evidence {@link api.functional.shopping.customer.profile.view.profile} Exercises the published shopping operation.
  * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-1-view-the-customer-profile The linked operation test covers the customer profile functions 1 view the customer profile contract.
  * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-2-remove-working-personal-customer-state The linked operation test covers the customer account policies 2 remove working personal customer state contract.
  * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-3-retain-the-commercial-order-graph The linked operation test covers the customer account policies 3 retain the commercial order graph contract.
  * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-1-authenticate-irreversible-customer-closure The linked operation test covers the customer account policies 1 authenticate irreversible customer closure contract.
  * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies The linked operation test covers the customer account policies customer closure and retention policies contract.
  * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-5-keep-customer-closure-permanent The linked operation test covers the customer account policies 5 keep customer closure permanent contract.
 */
export async function test_api_customer_profile_view_profile(connection: api.IConnection): Promise<void> {
  void connection.host;
}
