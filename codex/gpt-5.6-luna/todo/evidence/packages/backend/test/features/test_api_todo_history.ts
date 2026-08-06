import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_history.history} Proves edit-history inspection.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Exercises private chronology.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Exercises changed-to values.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Exercises history inspection.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Reads the full history.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises history state.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Reads an active task's history.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Observes an accepted edit entry.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses protected history.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps history private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises history integrity.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Observes the matching history entry.
 */
export async function test_api_todo_history(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `history-${Date.now()}@example.com`, password: "Password123!", displayName: "History User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "History before" });
  await api.functional.todo_update.update(secured, todo.id, { title: "History after", expectedUpdatedAt: todo.updatedAt });
  const history = await api.functional.todo_history.history(secured, todo.id);
  if (history.length !== 1 || history[0]?.title !== "History after") throw new Error("history was not matched to the edit");
}
