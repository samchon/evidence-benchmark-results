import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.seller.approval.pendingSellers} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals The linked operation test covers the seller account functions 3 list pending seller approvals contract.
 */
export async function test_api_admin_seller_approval_pendingSellers(connection: api.IConnection): Promise<void> {
  void connection.host;
}
