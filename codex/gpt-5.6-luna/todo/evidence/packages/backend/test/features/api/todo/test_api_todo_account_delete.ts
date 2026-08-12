import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves account deletion accepts the current password confirmation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Removes the account and its private cascade.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.account_delete.erase} Calls the published account deletion operation.
 * @evidenceReview {@link api.functional.todo.user.account_delete.erase} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_account_delete(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  if (await api.functional.todo.user.account_delete.erase(fixture.connection, { password: fixture.password }) !== true) throw new Error("Account deletion failed.");
}
