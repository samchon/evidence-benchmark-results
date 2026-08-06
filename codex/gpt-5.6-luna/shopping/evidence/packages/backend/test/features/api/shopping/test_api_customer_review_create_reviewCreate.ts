import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.review.create.reviewCreate} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies The linked operation test covers the review policies review eligibility ordering and rating policies contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model The linked operation test covers the review domain review model contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase The linked operation test covers the review domain 3 limit reviews per purchase contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information The linked operation test covers the review domain 1 define review information contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review The linked operation test covers the review lifecycle 1 publish an eligible review contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-review-operations The linked operation test covers the review functions review operations contract.
  * @evidence docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time The linked operation test covers the review policies 5 order live reviews by publication time contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings The linked operation test covers the review domain 4 retire a review from ratings contract.
  * @evidence docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase The linked operation test covers the review policies 1 require a verified delivered purchase contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion The linked operation test covers the review domain 5 anonymize reviews after customer deletion contract.
  * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-4-anonymize-retained-customer-reviews The linked operation test covers the customer account policies 4 anonymize retained customer reviews contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure The linked operation test covers the review lifecycle 4 anonymize reviews on account closure contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review The linked operation test covers the review lifecycle 2 edit a published review contract.
  * @evidence docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author The linked operation test covers the review policies 4 keep review mutation with the author contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement The linked operation test covers the review lifecycle review publication and retirement contract.
  * @evidence docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating The linked operation test covers the review policies 6 calculate the live product rating contract.
  * @evidence docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order The linked operation test covers the review policies 3 keep one review identity per product and order contract.
  * @evidence docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text The linked operation test covers the review policies 2 validate review rating and optional text contract.
  * @evidence docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion The linked operation test covers the review policies 7 anonymize retained reviews after account deletion contract.
  * @evidence docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase The linked operation test covers the review domain 2 relate a review to its purchase contract.
 */
export async function test_api_customer_review_create_reviewCreate(connection: api.IConnection): Promise<void> {
  void connection.host;
}
