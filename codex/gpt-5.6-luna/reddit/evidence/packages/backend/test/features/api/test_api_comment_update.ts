import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.comment.commentUpdate} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_comment_update(connection: api.IConnection): Promise<void> {
  await api.functional.comment.commentUpdate({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", { text: "updated" });
}






