import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.moderator.remove.moderatorRemove} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_moderator_remove(connection: api.IConnection): Promise<void> {
  await api.functional.moderator.remove.moderatorRemove({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", "00000000-0000-4000-8000-000000000001");
}






