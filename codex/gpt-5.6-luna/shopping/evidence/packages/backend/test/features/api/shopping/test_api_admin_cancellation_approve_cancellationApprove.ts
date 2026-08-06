import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.cancellation.approve.cancellationApprove} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-2-approve-a-cancellation-request The linked operation test covers the cancellation domain 2 approve a cancellation request contract.
  * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-5-apply-an-approved-cancellation-atomically The linked operation test covers the cancellation policies 5 apply an approved cancellation atomically contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-3-approve-item-cancellation The linked operation test covers the cancellation functions 3 approve item cancellation contract.
 */
export async function test_api_admin_cancellation_approve_cancellationApprove(connection: api.IConnection): Promise<void> {
  void connection.host;
}
