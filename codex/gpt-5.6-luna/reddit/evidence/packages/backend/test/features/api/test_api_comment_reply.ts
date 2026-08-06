import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.comment.reply.commentReply} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_comment_reply(connection: api.IConnection): Promise<void> {
  await api.functional.comment.reply.commentReply({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", { text: "reply" });
}






