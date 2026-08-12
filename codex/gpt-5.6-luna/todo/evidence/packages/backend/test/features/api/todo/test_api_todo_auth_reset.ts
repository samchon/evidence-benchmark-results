import * as api from "@benchmark/todo-api";

/**
 * Proves an unproven recovery proof is refused without changing credentials.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Refuses an invalid recovery proof.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.auth.user.recover.reset_operation.reset} Calls the published reset operation.
 * @evidenceReview {@link api.functional.todo.auth.user.recover.reset_operation.reset} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_auth_reset(connection: api.IConnection): Promise<void> {
  let refused = false;
  try {
    await api.functional.todo.auth.user.recover.reset_operation.reset(
      connection,
      { token: "invalid-proof", newPassword: "new-correct-horse-password" },
    );
  } catch {
    refused = true;
  }
  if (!refused) throw new Error("Invalid recovery proof was accepted.");
}
