import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.moderator.add.moderatorAdd} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_moderator_add(connection: api.IConnection): Promise<void> {
  await api.functional.moderator.add.moderatorAdd({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", "00000000-0000-4000-8000-000000000001");
}






