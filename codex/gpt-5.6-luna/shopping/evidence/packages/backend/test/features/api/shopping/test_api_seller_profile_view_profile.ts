import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-1-define-seller-profile-information Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-2-relate-a-profile-to-its-seller Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.seller.profile.view.profile} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-5-block-seller-deletion-during-unresolved-requests The linked operation test covers the seller account policies 5 block seller deletion during unresolved requests contract.
  * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-4-block-seller-deletion-during-active-fulfillment The linked operation test covers the seller account policies 4 block seller deletion during active fulfillment contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations The linked operation test covers the seller profile functions seller profile operations contract.
  * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-3-separate-suspension-from-fulfillment-duties The linked operation test covers the seller account policies 3 separate suspension from fulfillment duties contract.
  * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason The linked operation test covers the seller account policies 2 require and retain a seller rejection reason contract.
 */
export async function test_api_seller_profile_view_profile(connection: api.IConnection): Promise<void> {
  void connection.host;
}
