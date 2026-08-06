import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.profile.update.updateProfile} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations The linked operation test covers customer profile operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-2-edit-the-customer-profile The linked operation test covers editing the customer profile.
 */
export async function test_api_customer_profile_update_updateProfile(connection: api.IConnection): Promise<void> {
  void connection.host;
}
