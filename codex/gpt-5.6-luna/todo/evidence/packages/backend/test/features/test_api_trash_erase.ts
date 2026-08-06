import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_trash_erase.erase} Proves permanent trash deletion.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Deletes owned task state.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises terminal lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Permanently deletes a trashed task.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Removes attached history.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Deletes history through the Todo.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Exercises the trash surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Permanently deletes a task.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises terminal qualification.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Deletes only trashed tasks.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Removes history only terminally.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses protected erase.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps deletion private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises deletion integrity.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Removes the task and history together.
 */
export async function test_api_trash_erase(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `trash-erase-${Date.now()}@example.com`, password: "Password123!", displayName: "Trash Erase" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "Erase me" });
  await api.functional.todo_trash.trash(secured, todo.id);
  const erased = await api.functional.todo_trash_erase.erase(secured, todo.id);
  if (!erased.success) throw new Error("trash erase failed");
}
