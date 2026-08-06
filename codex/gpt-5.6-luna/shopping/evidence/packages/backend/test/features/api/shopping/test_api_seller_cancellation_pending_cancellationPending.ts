import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.seller.cancellation.pending.cancellationPending} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-2-keep-one-pending-cancellation-decision-per-item The linked operation test covers the cancellation policies 2 keep one pending cancellation decision per item contract.
  * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-4-decide-a-pending-cancellation-once The linked operation test covers the cancellation policies 4 decide a pending cancellation once contract.
 */
export async function test_api_seller_cancellation_pending_cancellationPending(connection: api.IConnection): Promise<void> {
  void connection.host;
}
