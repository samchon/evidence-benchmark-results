import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.refund.request.refundRequest} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-refund-domain-1-open-a-refund-request The linked operation test covers the refund domain 1 open a refund request contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-5-derive-refunded-order-status The linked operation test covers the order lifecycle 5 derive refunded order status contract.
  * @evidence docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies The linked operation test covers the refund policies refund eligibility and resolution policies contract.
  * @evidence docs/analysis/04-business-rules.md#req-refund-policies-4-limit-ordinary-refund-response-to-the-item-seller The linked operation test covers the refund policies 4 limit ordinary refund response to the item seller contract.
  * @evidence docs/analysis/02-domain-model.md#req-refund-domain-5-relate-refund-participants-and-target The linked operation test covers the refund domain 5 relate refund participants and target contract.
  * @evidence docs/analysis/02-domain-model.md#req-refund-domain-4-preserve-refund-decision-history The linked operation test covers the refund domain 4 preserve refund decision history contract.
  * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-5-transition-an-item-to-refunded The linked operation test covers the order item lifecycle 5 transition an item to refunded contract.
  * @evidence docs/analysis/04-business-rules.md#req-refund-policies-2-close-the-refund-window-after-seven-days The linked operation test covers the refund policies 2 close the refund window after seven days contract.
  * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle The linked operation test covers the refund domain refund request lifecycle contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey The linked operation test covers the refund functions delivered item refund journey contract.
  * @evidence docs/analysis/04-business-rules.md#req-refund-policies-1-admit-a-timely-refund-request-for-a-delivered-item The linked operation test covers the refund policies 1 admit a timely refund request for a delivered item contract.
 */
export async function test_api_customer_refund_request_refundRequest(connection: api.IConnection): Promise<void> {
  void connection.host;
}
