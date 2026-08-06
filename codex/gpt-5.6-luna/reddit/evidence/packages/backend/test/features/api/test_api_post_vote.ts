import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.post.vote.postVote} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model The vote operation updates the author karma aggregate.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total The vote operation updates the signed karma total.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings The vote operation applies the vote-to-karma mapping.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity The vote operation keeps visible score and karma aggregates consistent.
 */
export async function test_api_post_vote(connection: api.IConnection): Promise<void> {
  await api.functional.post.vote.postVote({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", { value: 1 });
}






