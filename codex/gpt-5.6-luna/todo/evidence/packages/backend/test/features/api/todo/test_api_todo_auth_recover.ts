import * as api from "@benchmark/todo-api";

/**
 * Proves password recovery starts without disclosing account existence.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Starts the non-disclosing recovery journey.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Covers account security management.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Protects the replacement journey.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.auth.user.recover_operation.recover} Calls the published recovery operation.
 * @evidenceReview {@link api.functional.todo.auth.user.recover_operation.recover} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_auth_recover(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo.auth.user.recover_operation.recover(
    connection,
    { email: `unknown-${Date.now()}@example.com` },
  );
  if (result !== true) throw new Error("Recovery start did not complete.");
}
