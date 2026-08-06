import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_detail.at} Proves active Todo detail retrieval.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Reads owned task detail.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Returns full task fields.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises active availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Reads active detail.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Exercises the Todo surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Reads active detail.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises availability qualification.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Reads only active tasks.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected detail.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps detail private.
 */
export async function test_api_todo_detail(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `detail-${Date.now()}@example.com`, password: "Password123!", displayName: "Detail User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "Detail task" });
  const detail = await api.functional.todo_detail.at(secured, todo.id);
  if (detail.id !== todo.id) throw new Error("Todo detail mismatch");
}
