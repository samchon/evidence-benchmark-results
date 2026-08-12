import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves active Todo detail returns the complete current content.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Returns full active detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.todo.detail.at} Calls the published active-detail operation.
 * @evidenceReview {@link api.functional.todo.user.todo.detail.at} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_at(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  const todo = await api.functional.todo.user.todo.detail.at(fixture.connection, created.id);
  if (todo.id !== created.id || todo.description !== "Initial description") throw new Error("Active Todo detail was incomplete.");
}
