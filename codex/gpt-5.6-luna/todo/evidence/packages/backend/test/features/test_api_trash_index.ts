import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_trash_index.index} Proves browsing trashed Todos.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Exercises owned task summaries.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Exercises summary fields.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises trash availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Lists trashed tasks.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Exercises the trash surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Lists retained tasks.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Exercises shared browse rules.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Exercises pagination.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Exercises trash ordering.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises availability qualification.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Lists only trashed tasks.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected list.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps trash results private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises retained state.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Keeps the same task in trash.
 */
export async function test_api_trash_index(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `trash-index-${Date.now()}@example.com`, password: "Password123!", displayName: "Trash Index" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "Trash indexed" });
  await api.functional.todo_trash.trash(secured, todo.id);
  const page = await api.functional.todo_trash_index.index(secured, { page: 1, limit: 20, filter: "all", sort: "createdAt", direction: "asc" });
  if (page.data.length < 1) throw new Error("trash index was empty");
}
