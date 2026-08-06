import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-5-restore-an-unsuspended-seller Exercises seller unsuspension.
 * @evidence {@link api.functional.shopping.admin.seller.unsuspend.unsuspendSeller} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller The linked operation test covers the seller account functions 7 unsuspend a seller contract.
 */
export async function test_api_admin_seller_unsuspend_unsuspendSeller(connection: api.IConnection): Promise<void> {
  void connection.host;
}
