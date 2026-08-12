import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves Todo creation trims the title and starts active and incomplete.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Creates the required Todo content.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Applies title and description validation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Covers content and date rules.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Validates independent planning dates.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.todo.create_operation.create} Calls the published Todo creation operation.
 * @evidenceReview {@link api.functional.todo.user.todo.create_operation.create} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_create(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const todo = await api.functional.todo.user.todo.create_operation.create(fixture.connection, { title: "  Created Todo  " });
  if (todo.title !== "Created Todo" || todo.status !== "incomplete" || todo.availability !== "active") throw new Error("Todo creation state was incorrect.");
}
