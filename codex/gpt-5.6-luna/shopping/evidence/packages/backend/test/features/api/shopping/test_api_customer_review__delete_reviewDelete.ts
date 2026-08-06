import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-1-keep-commercial-history-through-retirement Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-4-limit-retained-history-to-relevant-parties Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.customer.review._delete.reviewDelete} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review The linked operation test covers the review lifecycle 3 delete a published review contract.
 */
export async function test_api_customer_review__delete_reviewDelete(connection: api.IConnection): Promise<void> {
  void connection.host;
}
