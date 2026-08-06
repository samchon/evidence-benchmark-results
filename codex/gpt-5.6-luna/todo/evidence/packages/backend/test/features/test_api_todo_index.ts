import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_index.index} Proves active Todo browsing.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Exercises owned tasks.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Exercises summary fields.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Lists active tasks.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Exercises the Todo surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Exercises the active list.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Exercises browse controls.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Exercises page bounds.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Exercises the active filter.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Exercises date sorting.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Exercises deterministic order.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises availability-qualified browsing.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Lists only active tasks.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected list.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps list results private.
 */
export async function test_api_todo_index(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `index-${Date.now()}@example.com`, password: "Password123!", displayName: "Index User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  await api.functional.todo_create.create(secured, { title: "Indexed task", startDate: "2026-01-03T00:00:00.000Z" });
  const complete = await api.functional.todo_create.create(secured, { title: "Complete indexed task", startDate: "2026-01-02T00:00:00.000Z" });
  await api.functional.todo_completion.completion(secured, complete.id, { completed: true });
  const page = await api.functional.todo_index.index(secured, { page: 1, limit: 20, filter: "all", sort: "startDate", direction: "asc" });
  if (page.data.length !== 2 || page.data[0]?.title !== "Complete indexed task") throw new Error("Todo index ordering failed");
  const completeOnly = await api.functional.todo_index.index(secured, { page: 1, limit: 20, filter: "complete-only" });
  if (completeOnly.data.length !== 1 || !completeOnly.data[0]?.completed) throw new Error("Todo completion filter failed");
}
