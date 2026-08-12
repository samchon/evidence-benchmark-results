import * as api from "@benchmark/todo-api";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import { createTodo, joinUser } from "../../../helpers/TodoSetup";

/**
 * Proves creation persists an active incomplete Todo.
 *
 * 1. Join an account and create a Todo with content and dates.
 * 2. Assert the created detail contains the normalized persisted state.
 * 3. Read its history and assert creation created no edit entry.
 */
export async function test_api_todo_create(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with content and dates
  const user = await joinUser(connection);
  const todo = await createTodo(user.connection, { description: "A persisted detail", startDate: "2026-08-10", dueDate: "2026-08-11" });
  // Step 2: Assert the created detail contains the normalized persisted state
  typia.assert(todo);
  TestValidator.equals("creation trims and persists the title", todo.title, "Prepare the release");
  TestValidator.equals("creation persists the description", todo.description, "A persisted detail");
  TestValidator.equals("creation persists the start date", todo.startDate, "2026-08-10");
  TestValidator.equals("creation persists the due date", todo.dueDate, "2026-08-11");
  TestValidator.predicate("creation records a timestamp", todo.createdAt.length > 0);
  TestValidator.equals("creation starts at content version zero", todo.version, 0);
  TestValidator.equals("creation has no trash timestamp", todo.trashedAt, null);
  TestValidator.equals("new Todo starts incomplete", todo.completion, "incomplete");
  TestValidator.equals("new Todo starts active", todo.availability, "active");
  // Step 3: Read its history and assert creation created no edit entry
  TestValidator.equals("creation creates no edit history", (await api.functional.todo.user.todo.history(user.connection, todo.id)).length, 0);
}

/**
 * Proves an explicitly empty optional description has the public empty form.
 *
 * 1. Join an account and create a Todo with an empty description.
 * 2. Assert creation exposes the empty description as null.
 * 3. Read the Todo and assert the representation remains stable.
 */
export async function test_api_todo_create_empty_description(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with an empty description
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { description: "" });
  // Step 2: Assert creation exposes the empty description as null
  typia.assert(created);
  TestValidator.equals("empty description is represented as null", created.description, null);
  // Step 3: Read the Todo and assert the representation remains stable
  const current = await api.functional.todo.user.todo.at(user.connection, created.id);
  TestValidator.equals("empty description remains null after reread", current.description, null);
}

/**
 * Proves an active Todo detail exposes its full persisted content.
 *
 * 1. Join an account and create a Todo with a description.
 * 2. Read the active detail through its public accessor.
 * 3. Assert the response preserves every relevant persisted fact.
 */
export async function test_api_todo_at(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with a description
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { description: "Full detail" });
  // Step 2: Read the active detail through its public accessor
  const found = await api.functional.todo.user.todo.at(user.connection, created.id);
  // Step 3: Assert the response preserves every relevant persisted fact
  typia.assert(found);
  TestValidator.equals("detail retains identity", found.id, created.id);
  TestValidator.equals("detail retains title", found.title, created.title);
  TestValidator.equals("detail retains full description", found.description, "Full detail");
  TestValidator.equals("detail retains optional dates", found.startDate, created.startDate);
  TestValidator.equals("detail retains completion", found.completion, created.completion);
  TestValidator.equals("detail retains creation time", found.createdAt, created.createdAt);
  TestValidator.equals("detail reports active availability", found.availability, "active");
}

/**
 * Proves active browsing filters to the owner and selected completion scope.
 *
 * 1. Join an account and create incomplete and complete Todos.
 * 2. Browse each supported completion scope.
 * 3. Assert filtering and compact summary behavior.
 */
export async function test_api_todo_index(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create incomplete and complete Todos
  const user = await joinUser(connection);
  await createTodo(user.connection, { title: "Incomplete task" });
  const complete = await createTodo(user.connection, { title: "Complete task" });
  await api.functional.todo.user.todo.complete(user.connection, complete.id);
  // Step 2: Browse each supported completion scope
  const page = await api.functional.todo.user.todo.index(user.connection, { completion: "complete-only", page: 1, limit: 20 });
  typia.assert(page);
  TestValidator.equals("complete filter returns one Todo", page.data.length, 1);
  TestValidator.equals("complete filter selects the marked Todo", page.data[0]?.id, complete.id);
  const all = await api.functional.todo.user.todo.index(user.connection, { completion: "all", page: 1, limit: 20 });
  TestValidator.equals("all filter includes both states", all.data.length, 2);
  const incomplete = await api.functional.todo.user.todo.index(user.connection, { completion: "incomplete-only", page: 1, limit: 20 });
  // Step 3: Assert filtering and compact summary behavior
  TestValidator.equals("incomplete filter excludes completed Todos", incomplete.data.length, 1);
  if (page.data[0] !== undefined && "description" in page.data[0]) throw new Error("Active summary exposed full detail fields.");
}

/**
 * Proves content edit changes supplied fields and records the new detail.
 *
 * 1. Join an account and create a Todo with an original description.
 * 2. Update that description using the creation version.
 * 3. Read the Todo and history and assert the accepted change is persisted once.
 */
export async function test_api_todo_update(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with an original description
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { description: "Before" });
  // Step 2: Update that description using the creation version
  const updated = await api.functional.todo.user.todo.update(user.connection, created.id, { version: created.version, description: "After" });
  // Step 3: Read the Todo and history and assert the accepted change is persisted once
  typia.assert(updated);
  TestValidator.equals("updated content persists", updated.description, "After");
  TestValidator.equals("content version advances", updated.version, created.version + 1);
  TestValidator.equals("content edit preserves completion", updated.completion, created.completion);
  TestValidator.equals("content edit preserves availability", updated.availability, created.availability);
  TestValidator.equals("content edit preserves creation time", updated.createdAt, created.createdAt);
  const history = await api.functional.todo.user.todo.history(user.connection, created.id);
  TestValidator.equals("content edit creates one history entry", history.length, 1);
  TestValidator.equals("history matches the accepted edit", history[0]?.description, "After");
}

/**
 * Proves marking a Todo complete changes completion without changing content history.
 *
 * 1. Join an account and create an incomplete Todo.
 * 2. Mark it complete and repeat the command.
 * 3. Read the result and history and assert only completion changed.
 */
export async function test_api_todo_complete(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create an incomplete Todo
  const user = await joinUser(connection);
  const created = await createTodo(user.connection);
  // Step 2: Mark it complete and repeat the command
  const completed = await api.functional.todo.user.todo.complete(user.connection, created.id);
  typia.assert(completed);
  TestValidator.equals("Todo becomes complete", completed.completion, "complete");
  TestValidator.equals("completion preserves identity", completed.id, created.id);
  TestValidator.equals("completion preserves content", completed.description, created.description);
  TestValidator.equals("completion preserves creation time", completed.createdAt, created.createdAt);
  const repeated = await api.functional.todo.user.todo.complete(user.connection, created.id);
  // Step 3: Read the result and history and assert only completion changed
  TestValidator.equals("repeated completion remains complete", repeated.completion, "complete");
  const history = await api.functional.todo.user.todo.history(user.connection, created.id);
  TestValidator.equals("completion adds no content history", history.length, 0);
}

/**
 * Proves marking a complete Todo incomplete restores the independent status.
 *
 * 1. Join an account, create a Todo, and mark it complete.
 * 2. Mark the Todo incomplete and repeat the command.
 * 3. Read history and assert completion transitions add no content entries.
 */
export async function test_api_todo_incomplete(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account, create a Todo, and mark it complete
  const user = await joinUser(connection);
  const created = await createTodo(user.connection);
  await api.functional.todo.user.todo.complete(user.connection, created.id);
  // Step 2: Mark the Todo incomplete and repeat the command
  const incomplete = await api.functional.todo.user.todo.incomplete(user.connection, created.id);
  typia.assert(incomplete);
  TestValidator.equals("Todo becomes incomplete", incomplete.completion, "incomplete");
  TestValidator.equals("incomplete transition preserves content", incomplete.description, created.description);
  const repeated = await api.functional.todo.user.todo.incomplete(user.connection, created.id);
  // Step 3: Read history and assert completion transitions add no content entries
  TestValidator.equals("repeated incomplete remains incomplete", repeated.completion, "incomplete");
  TestValidator.equals("completion transitions create no history", (await api.functional.todo.user.todo.history(user.connection, created.id)).length, 0);
}

/**
 * Proves a successful content edit creates one matching immutable history entry.
 *
 * 1. Join an account and create a Todo with an old description.
 * 2. Accept one description edit.
 * 3. Read the Todo and history and assert one matching entry is visible.
 */
export async function test_api_todo_history(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with an old description
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { description: "Old detail" });
  // Step 2: Accept one description edit
  await api.functional.todo.user.todo.update(user.connection, created.id, { version: created.version, description: "New detail" });
  // Step 3: Read the Todo and history and assert one matching entry is visible
  const history = await api.functional.todo.user.todo.history(user.connection, created.id);
  typia.assert(history);
  TestValidator.equals("one content edit creates one history entry", history.length, 1);
  TestValidator.equals("history records changed description", history[0]?.description, "New detail");
  TestValidator.equals("history omits unchanged title", history[0]?.title, undefined);
  TestValidator.equals("history preserves the accepted Todo", (await api.functional.todo.user.todo.at(user.connection, created.id)).description, "New detail");
}

/**
 * Proves soft deletion moves the same Todo into trash and out of active detail.
 *
 * 1. Join an account and create an active Todo.
 * 2. Move it to trash through the active command.
 * 3. Observe active list, detail, and history and assert the recoverable move.
 */
export async function test_api_todo_trash(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create an active Todo
  const user = await joinUser(connection);
  const created = await createTodo(user.connection);
  // Step 2: Move it to trash through the active command
  const trashed = await api.functional.todo.user.todo.trash(user.connection, created.id);
  // Step 3: Observe active list, detail, and history and assert the recoverable move
  typia.assert(trashed);
  TestValidator.equals("soft delete marks the same Todo trashed", trashed.id, created.id);
  TestValidator.equals("soft delete preserves content", trashed.description, created.description);
  TestValidator.equals("soft delete records a trash timestamp", trashed.trashedAt !== null, true);
  TestValidator.equals("soft delete creates no edit history", (await api.functional.todo.user.todo.history(user.connection, created.id)).length, 0);
  const active = await api.functional.todo.user.todo.index(user.connection, {});
  if (active.data.some((item) => item.id === created.id)) throw new Error("Trashed Todo remained in the active list.");
  await TestValidator.error("trashed Todo leaves active detail", () => api.functional.todo.user.todo.at(user.connection, created.id));
}
