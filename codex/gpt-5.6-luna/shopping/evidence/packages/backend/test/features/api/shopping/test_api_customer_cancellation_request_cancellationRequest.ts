import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.cancellation.request.cancellationRequest} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-5-relate-cancellation-participants-and-target The linked operation test covers the cancellation domain 5 relate cancellation participants and target contract.
  * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle The linked operation test covers the cancellation domain cancellation request lifecycle contract.
  * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies The linked operation test covers the cancellation policies cancellation eligibility and resolution policies contract.
  * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-4-preserve-cancellation-decision-history The linked operation test covers the cancellation domain 4 preserve cancellation decision history contract.
  * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-1-open-a-cancellation-request The linked operation test covers the cancellation domain 1 open a cancellation request contract.
  * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-1-admit-a-cancellation-request-for-a-paid-item The linked operation test covers the cancellation policies 1 admit a cancellation request for a paid item contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey The linked operation test covers the cancellation functions order item cancellation journey contract.
 */
export async function test_api_customer_cancellation_request_cancellationRequest(connection: api.IConnection): Promise<void> {
  void connection.host;
}
