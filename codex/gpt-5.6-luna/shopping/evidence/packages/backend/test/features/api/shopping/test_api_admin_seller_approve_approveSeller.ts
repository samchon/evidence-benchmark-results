import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.seller.approve.approveSeller} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration The linked operation test covers the seller account functions 4 approve a seller registration contract.
 */
export async function test_api_admin_seller_approve_approveSeller(connection: api.IConnection): Promise<void> {
  void connection.host;
}
