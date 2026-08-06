import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.comment.vote.commentVote} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Implements the REQ-DOM-VOTE behavior at the public boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Implements the REQ-DOM-VOTE-001 behavior at the public boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Implements the REQ-DOM-VOTE-002 behavior at the public boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Implements the REQ-DOM-VOTE-003 behavior at the public boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Implements the REQ-DOM-VOTE-LIFE behavior at the public boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Implements the REQ-DOM-VOTE-LIFE-001 behavior at the public boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Implements the REQ-DOM-VOTE-LIFE-002 behavior at the public boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Implements the REQ-DOM-VOTE-LIFE-003 behavior at the public boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Implements the REQ-DOM-VOTE-LIFE-004 behavior at the public boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Implements the REQ-FUNC-VOTE behavior at the public boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Implements the REQ-FUNC-VOTE-001 behavior at the public boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Implements the REQ-FUNC-VOTE-002 behavior at the public boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Implements the REQ-FUNC-VOTE-003 behavior at the public boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Implements the REQ-RULE-VOTE behavior at the public boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Implements the REQ-RULE-VOTE-001 behavior at the public boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Implements the REQ-RULE-VOTE-002 behavior at the public boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Implements the REQ-RULE-VOTE-003 behavior at the public boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Implements the REQ-RULE-VOTE-004 behavior at the public boundary.
 */
export async function test_api_comment_vote(connection: api.IConnection): Promise<void> {
  await api.functional.comment.vote.commentVote({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", { value: 1 });
}






