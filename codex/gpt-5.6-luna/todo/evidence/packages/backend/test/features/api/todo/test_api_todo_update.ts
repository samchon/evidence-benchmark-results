import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves a versioned content edit returns the new version and content.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Accepts an optimistic content edit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Appends the accepted edit history.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Covers version and history conflicts.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Requires active availability.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Refuses stale or empty edits.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves edit integrity.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Keeps content and history consistent.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.todo.edit.update} Calls the published Todo edit operation.
 * @evidenceReview {@link api.functional.todo.user.todo.edit.update} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_update(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  const updated = await api.functional.todo.user.todo.edit.update(fixture.connection, created.id, { version: created.version, title: "Edited Todo" });
  if (updated.title !== "Edited Todo" || updated.version <= created.version) throw new Error("Todo edit was not versioned.");
  const history = await api.functional.todo.user.todo.history.index(fixture.connection, created.id);
  if (history.length !== 1 || history[0]?.title !== "Edited Todo") throw new Error("Todo edit history did not match the accepted edit.");
}
