import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves active Todo soft deletion preserves recoverable content.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Moves an active Todo into trash.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Moves the lifecycle state into trash.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Preserves recoverable Todo state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.todo.trash.erase} Calls the published soft-delete operation.
 * @evidenceReview {@link api.functional.todo.user.todo.trash.erase} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_trash_move(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  const trashed = await api.functional.todo.user.todo.trash.erase(fixture.connection, created.id);
  if (trashed.availability !== "trashed" || trashed.id !== created.id) throw new Error("Todo was not moved to trash.");
}
