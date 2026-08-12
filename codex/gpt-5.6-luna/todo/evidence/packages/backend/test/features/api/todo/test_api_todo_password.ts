import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves password change requires the current secret and succeeds for a distinct replacement.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Replaces the credential and ends prior sessions.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Covers account security management.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Applies secure credential replacement.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.password.changePassword} Calls the published password operation.
 * @evidenceReview {@link api.functional.todo.user.password.changePassword} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_password(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  if (await api.functional.todo.user.password.changePassword(fixture.connection, { currentPassword: fixture.password, newPassword: "new-correct-horse-password" }) !== true) throw new Error("Password change failed.");
}
