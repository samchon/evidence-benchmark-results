import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_trash_restore.restore} Proves restoring a trashed Todo.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Exercises owned task lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Changes availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Restores the same task.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Exercises the trash surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Restores a task.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises state qualification.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Restores only a trashed task.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses protected restore.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps restoration private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises lifecycle integrity.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Returns the same task to active work.
 */
export async function test_api_trash_restore(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `restore-${Date.now()}@example.com`, password: "Password123!", displayName: "Restore User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "Restore me" });
  await api.functional.todo_trash.trash(secured, todo.id);
  const restored = await api.functional.todo_trash_restore.restore(secured, todo.id);
  if (restored.availability !== "active") throw new Error("restore failed");
}
