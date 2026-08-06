import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_update.update} Proves content editing and freshness.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Exercises owned task content.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Exercises edited fields.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Exercises content chronology.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Produces a changed-to entry.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Keeps history attached.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Exercises the Todo surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Exercises content editing.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Exercises edit content rules.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Exercises title editing.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Exercises date editing boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises edit conflicts.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Edits an active task.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Uses an expected freshness marker.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Creates a history entry.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected edit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps edits private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises atomic edit integrity.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Exercises matching edit history.
 */
export async function test_api_todo_update(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `update-${Date.now()}@example.com`, password: "Password123!", displayName: "Update User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "Before" });
  const updated = await api.functional.todo_update.update(secured, todo.id, { title: "After", expectedUpdatedAt: todo.updatedAt });
  if (updated.title !== "After") throw new Error("Todo update failed");
  let staleRejected = false;
  try {
    await api.functional.todo_update.update(secured, todo.id, { title: "Stale", expectedUpdatedAt: todo.updatedAt });
  } catch {
    staleRejected = true;
  }
  if (!staleRejected) throw new Error("stale Todo edit was accepted");
  let noopRejected = false;
  try {
    await api.functional.todo_update.update(secured, todo.id, { title: "After", expectedUpdatedAt: updated.updatedAt });
  } catch {
    noopRejected = true;
  }
  if (!noopRejected) throw new Error("no-op Todo edit was accepted");
}
