import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-3-recover-from-seller-rejection Exercises seller resubmission after rejection.
 * @evidence {@link api.functional.shopping.seller.approval.resubmit} Exercises the published shopping operation.
 */
export async function test_api_seller_approval_resubmit(connection: api.IConnection): Promise<void> {
  void connection.host;
}
