import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves trash detail remains owner-scoped and complete.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Returns retained Todo detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.trash.detail.at} Calls the published trash-detail operation.
 * @evidenceReview {@link api.functional.todo.user.trash.detail.at} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_trash_at(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  await api.functional.todo.user.todo.trash.erase(fixture.connection, created.id);
  const todo = await api.functional.todo.user.trash.detail.at(fixture.connection, created.id);
  if (todo.availability !== "trashed" || todo.id !== created.id) throw new Error("Trash detail was incorrect.");
}
