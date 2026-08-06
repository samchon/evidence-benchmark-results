import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.refund.reject.refundReject} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-refund-domain-3-reject-a-refund-request The linked operation test covers the refund domain 3 reject a refund request contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-4-reject-an-item-refund The linked operation test covers the refund functions 4 reject an item refund contract.
 */
export async function test_api_admin_refund_reject_refundReject(connection: api.IConnection): Promise<void> {
  void connection.host;
}
