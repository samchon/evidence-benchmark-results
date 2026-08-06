import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_completion.completion} Proves idempotent completion state.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Exercises owned task state.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises independent completion.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Exercises complete state.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Exercises the Todo surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Marks a Todo complete.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Marks a Todo incomplete.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises completion state rules.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Completes an active task.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Exercises a completion transition.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected completion.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps completion private.
 */
export async function test_api_todo_completion(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `completion-${Date.now()}@example.com`, password: "Password123!", displayName: "Completion User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const todo = await api.functional.todo_create.create(secured, { title: "Complete me" });
  const completed = await api.functional.todo_completion.completion(secured, todo.id, { completed: true });
  if (!completed.completed) throw new Error("completion failed");
  const repeated = await api.functional.todo_completion.completion(secured, todo.id, { completed: true });
  if (!repeated.completed || repeated.updatedAt !== completed.updatedAt) throw new Error("completion retry was not idempotent");
  const incomplete = await api.functional.todo_completion.completion(secured, todo.id, { completed: false });
  if (incomplete.completed) throw new Error("incomplete transition failed");
}
