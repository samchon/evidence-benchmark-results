import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves an active Todo can be marked incomplete.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Marks an active Todo incomplete.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.todo.incomplete_operation.incomplete} Calls the published incompletion operation.
 * @evidenceReview {@link api.functional.todo.user.todo.incomplete_operation.incomplete} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_incomplete(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  const incomplete = await api.functional.todo.user.todo.incomplete_operation.incomplete(fixture.connection, created.id);
  if (incomplete.status !== "incomplete") throw new Error("Todo incompletion state was incorrect.");
  const repeated = await api.functional.todo.user.todo.incomplete_operation.incomplete(fixture.connection, created.id);
  if (repeated.status !== "incomplete" || repeated.version !== incomplete.version) throw new Error("Repeated incompletion was not idempotent.");
}
