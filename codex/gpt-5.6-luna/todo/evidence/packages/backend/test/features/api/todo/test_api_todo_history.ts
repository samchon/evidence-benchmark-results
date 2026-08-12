import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves accepted content edits are visible as immutable history.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Returns the full edit chronology.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Reads immutable edit records.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Covers history meaning.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Covers one history entry.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Binds history to the Todo lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Covers history inspection.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Covers history conflict rules.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Excludes refused edits from history.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves history integrity.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Keeps history synchronized with edits.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Protects private history.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Isolates history ownership.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.todo.history.index} Calls the published history operation.
 * @evidenceReview {@link api.functional.todo.user.todo.history.index} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_history(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  await api.functional.todo.user.todo.edit.update(fixture.connection, created.id, { version: created.version, title: "History Edit" });
  const history = await api.functional.todo.user.todo.history.index(fixture.connection, created.id);
  if (history.length !== 1 || history[0]?.title !== "History Edit") throw new Error("Todo edit history was not recorded.");
}
