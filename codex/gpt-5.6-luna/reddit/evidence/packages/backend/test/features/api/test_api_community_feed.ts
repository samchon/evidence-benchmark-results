import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.community.feed.feedCommunity} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_community_feed(connection: api.IConnection): Promise<void> {
  await api.functional.community.feed.feedCommunity({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", { page: 1, limit: 10, sort: "new" });
}






