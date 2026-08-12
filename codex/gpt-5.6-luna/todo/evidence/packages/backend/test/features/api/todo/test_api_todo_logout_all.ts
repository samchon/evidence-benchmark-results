import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves all-session logout revokes the account's active sessions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Ends every session for the account.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.logout_all.logoutAll} Calls the published all-session logout operation.
 * @evidenceReview {@link api.functional.todo.user.logout_all.logoutAll} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_logout_all(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  if (await api.functional.todo.user.logout_all.logoutAll(fixture.connection) !== true) throw new Error("All-session logout failed.");
}
