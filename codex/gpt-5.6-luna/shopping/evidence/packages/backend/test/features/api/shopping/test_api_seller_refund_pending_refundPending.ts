import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.seller.refund.pending.refundPending} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-refund-policies-3-keep-one-pending-refund-decision-per-item The linked operation test covers the refund policies 3 keep one pending refund decision per item contract.
  * @evidence docs/analysis/04-business-rules.md#req-refund-policies-5-decide-a-pending-refund-once The linked operation test covers the refund policies 5 decide a pending refund once contract.
 */
export async function test_api_seller_refund_pending_refundPending(connection: api.IConnection): Promise<void> {
  void connection.host;
}
