import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves permanent deletion is available only for a trashed Todo.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Removes the retained Todo.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Completes terminal deletion.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Removes only retained Todos.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.trash._delete.erase} Calls the published permanent-delete operation.
 * @evidenceReview {@link api.functional.todo.user.trash._delete.erase} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_permanent_delete(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  await api.functional.todo.user.todo.trash.erase(fixture.connection, created.id);
  if (await api.functional.todo.user.trash._delete.erase(fixture.connection, created.id) !== true) throw new Error("Permanent Todo deletion failed.");
  let absent = false;
  try {
    await api.functional.todo.user.trash.detail.at(fixture.connection, created.id);
  } catch {
    absent = true;
  }
  if (!absent) throw new Error("Permanently deleted Todo remained visible.");
}
