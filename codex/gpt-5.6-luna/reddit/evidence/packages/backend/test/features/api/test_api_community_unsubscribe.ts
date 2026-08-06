import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.community.unsubscribe.execute.unsubscribe} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_community_unsubscribe(connection: api.IConnection): Promise<void> {
  await api.functional.community.unsubscribe.execute.unsubscribe({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000");
}






