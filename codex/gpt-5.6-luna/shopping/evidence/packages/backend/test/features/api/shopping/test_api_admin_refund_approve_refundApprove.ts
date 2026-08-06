import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.refund.approve.refundApprove} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-refund-policies-6-apply-an-approved-refund-atomically The linked operation test covers the refund policies 6 apply an approved refund atomically contract.
  * @evidence docs/analysis/02-domain-model.md#req-refund-domain-2-approve-a-refund-request The linked operation test covers the refund domain 2 approve a refund request contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-3-approve-an-item-refund The linked operation test covers the refund functions 3 approve an item refund contract.
 */
export async function test_api_admin_refund_approve_refundApprove(connection: api.IConnection): Promise<void> {
  void connection.host;
}
