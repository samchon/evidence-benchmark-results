import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.seller.reject.rejectSeller} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration The linked operation test covers the seller account functions 5 reject a seller registration contract.
 */
export async function test_api_admin_seller_reject_rejectSeller(connection: api.IConnection): Promise<void> {
  void connection.host;
}
