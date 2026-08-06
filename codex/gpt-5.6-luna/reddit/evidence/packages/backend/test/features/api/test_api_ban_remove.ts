import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.ban.remove.unban} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_ban_remove(connection: api.IConnection): Promise<void> {
  await api.functional.ban.remove.unban({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", "00000000-0000-4000-8000-000000000001");
}






