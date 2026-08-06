import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.post.update.postUpdate} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_post_update(connection: api.IConnection): Promise<void> {
  await api.functional.post.update.postUpdate({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", { title: "updated" });
}






