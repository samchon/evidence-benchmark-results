import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves completion changes status without changing availability.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Marks an active Todo complete.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Keeps repeated completion safe.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.todo.complete_operation.complete} Calls the published completion operation.
 * @evidenceReview {@link api.functional.todo.user.todo.complete_operation.complete} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_complete(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const created = await TodoTestHelper.createTodo(fixture);
  const completed = await api.functional.todo.user.todo.complete_operation.complete(fixture.connection, created.id);
  if (completed.status !== "complete" || completed.availability !== "active") throw new Error("Todo completion state was incorrect.");
  const repeated = await api.functional.todo.user.todo.complete_operation.complete(fixture.connection, created.id);
  if (repeated.status !== "complete" || repeated.version !== completed.version) throw new Error("Repeated completion was not idempotent.");
}
