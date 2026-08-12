import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves restoration returns a retained Todo to active work.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Restores one retained Todo.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Restores the lifecycle state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Qualifies restoration by trash state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Preserves the recoverable Todo.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.trash.restore} Calls the published restore operation.
 * @evidenceReview {@link api.functional.todo.user.trash.restore} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_restore(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  await api.functional.todo.user.todo.trash.erase(fixture.connection, created.id);
  const restored = await api.functional.todo.user.trash.restore(fixture.connection, created.id);
  if (restored.availability !== "active" || restored.id !== created.id) throw new Error("Todo was not restored.");
}
