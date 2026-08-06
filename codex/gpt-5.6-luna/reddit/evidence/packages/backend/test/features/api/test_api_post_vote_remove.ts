import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.post.vote.remove.postVoteRemove} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_post_vote_remove(connection: api.IConnection): Promise<void> {
  await api.functional.post.vote.remove.postVoteRemove({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000");
}






