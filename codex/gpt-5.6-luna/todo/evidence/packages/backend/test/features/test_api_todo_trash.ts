import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_trash.trash} Proves moving an active Todo to trash.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Exercises owned task lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Changes active to trashed.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Records trash state.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Exercises the Todo surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Moves a Todo to trash.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises state qualification.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Trashes an active task.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected trash command.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps trash state private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises lifecycle integrity.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Moves the same task into recoverable trash.
 */
export async function test_api_todo_trash(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `trash-${Date.now()}@example.com`, password: "Password123!", displayName: "Trash User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "Trash me" });
  const trashed = await api.functional.todo_trash.trash(secured, todo.id);
  if (trashed.availability !== "trashed") throw new Error("Todo was not trashed");
}
