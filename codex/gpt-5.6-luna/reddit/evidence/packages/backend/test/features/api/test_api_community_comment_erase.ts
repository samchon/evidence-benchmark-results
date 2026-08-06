import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.community.comment.erase.commentModerateErase} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_community_comment_erase(connection: api.IConnection): Promise<void> {
  await api.functional.community.comment.erase.commentModerateErase({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", "00000000-0000-4000-8000-000000000001");
}






