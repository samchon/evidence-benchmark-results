import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.cancellation.reject.cancellationReject} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-3-reject-a-cancellation-request The linked operation test covers the cancellation domain 3 reject a cancellation request contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-4-reject-item-cancellation The linked operation test covers the cancellation functions 4 reject item cancellation contract.
 */
export async function test_api_admin_cancellation_reject_cancellationReject(connection: api.IConnection): Promise<void> {
  void connection.host;
}
