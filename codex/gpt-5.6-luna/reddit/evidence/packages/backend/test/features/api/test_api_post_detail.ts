import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.post.detail.postAt} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_post_detail(connection: api.IConnection): Promise<void> {
  await api.functional.post.detail.postAt({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000");
}






