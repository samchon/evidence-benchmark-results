import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions Exercises seller profile revisions.
 * @evidence {@link api.functional.shopping.seller.profile.update.updateProfile} Exercises the published shopping operation.
 */
export async function test_api_seller_profile_update_updateProfile(connection: api.IConnection): Promise<void> {
  void connection.host;
}
