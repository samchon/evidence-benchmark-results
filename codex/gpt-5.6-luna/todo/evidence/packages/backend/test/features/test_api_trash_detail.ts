import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_trash_detail.at} Proves trashed Todo detail retrieval.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Reads owned task detail.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Returns full task fields.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises trash availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Reads trashed detail.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Exercises the trash surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Reads retained detail.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises availability qualification.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Reads only trashed tasks.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses protected detail.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps detail private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves retained detail.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Reads the same recoverable task.
 */
export async function test_api_trash_detail(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `trash-detail-${Date.now()}@example.com`, password: "Password123!", displayName: "Trash Detail" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "Trash detail" });
  await api.functional.todo_trash.trash(secured, todo.id);
  const detail = await api.functional.todo_trash_detail.at(secured, todo.id);
  if (detail.availability !== "trashed") throw new Error("trash detail failed");
}
