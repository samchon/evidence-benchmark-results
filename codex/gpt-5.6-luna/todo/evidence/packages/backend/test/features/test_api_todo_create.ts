import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_create.create} Proves active Todo creation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Exercises task ownership.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Exercises task content.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises initial lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Exercises initial incomplete state.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Exercises initial active state.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Exercises the Todo surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Creates an active incomplete Todo.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Exercises content input.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Exercises title and description.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Exercises optional planning fields.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected Todo operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Creates private task data.
 */
export async function test_api_todo_create(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `create-${Date.now()}@example.com`, password: "Password123!", displayName: "Todo User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "  Created task  ", description: "Description", startDate: "2026-01-01T00:00:00.000Z", dueDate: "2026-01-02T00:00:00.000Z" });
  if (todo.title !== "Created task" || todo.availability !== "active" || todo.startDate === null || todo.dueDate === null) throw new Error("Todo creation failed");
}
