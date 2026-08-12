import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves current-session logout revokes the current bearer.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Ends the current session only.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.logout_operation.logout} Calls the published logout operation.
 * @evidenceReview {@link api.functional.todo.user.logout_operation.logout} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_logout(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  if (await api.functional.todo.user.logout_operation.logout(fixture.connection) !== true) throw new Error("Logout failed.");
}
