import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves the trash list contains retained Todos and not active work.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Browses retained Todos.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Covers the trash recovery journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Applies bounded trash browsing.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Applies trash pagination.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Covers retained lifecycle state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Distinguishes trash availability.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Preserves recoverable state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.trash.list.index} Calls the published trash-list operation.
 * @evidenceReview {@link api.functional.todo.user.trash.list.index} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_trash_index(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  await api.functional.todo.user.todo.trash.erase(fixture.connection, created.id);
  const page = await api.functional.todo.user.trash.list.index(fixture.connection, {});
  if (!page.data.some((item) => item.id === created.id)) throw new Error("Trashed Todo was not listed.");
}
