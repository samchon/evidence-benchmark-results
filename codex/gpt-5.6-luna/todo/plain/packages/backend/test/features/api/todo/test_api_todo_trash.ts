import * as api from "@benchmark/todo-api";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import { createTodo, joinUser } from "../../../helpers/TodoSetup";

/**
 * Proves trash browsing includes only retained owned Todos.
 *
 * 1. Join an account and move one Todo into trash.
 * 2. Browse the owner's trash list.
 * 3. Assert the retained summary and trash timestamp are present.
 */
export async function test_api_todo_trash_index(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and move one Todo into trash
  const user = await joinUser(connection);
  const created = await createTodo(user.connection);
  await api.functional.todo.user.todo.trash(user.connection, created.id);
  // Step 2: Browse the owner's trash list
  const page = await api.functional.todo.user.trash.index(user.connection, { page: 1, limit: 20 });
  // Step 3: Assert the retained summary and trash timestamp are present
  typia.assert(page);
  TestValidator.predicate("trash contains the retained Todo", page.data.some((item) => item.id === created.id));
  TestValidator.equals("trash excludes the active collection", page.pagination.records, 1);
  const item = page.data.find((value) => value.id === created.id);
  if (item === undefined) throw new Error("The retained Todo was missing from its trash summary.");
  TestValidator.equals("trash summary preserves the title", item.title, created.title);
  TestValidator.predicate("trash summary includes the trash timestamp", item.trashedAt !== null);
}

/**
 * Proves trash detail preserves the same content and lifecycle identity.
 *
 * 1. Join an account, create a detailed Todo, and move it to trash.
 * 2. Read the trashed detail.
 * 3. Assert identity, content, completion, creation, and trash state survive.
 */
export async function test_api_todo_trash_at(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account, create a detailed Todo, and move it to trash
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { description: "Retained detail" });
  await api.functional.todo.user.todo.trash(user.connection, created.id);
  // Step 2: Read the trashed detail
  const found = await api.functional.todo.user.trash.at(user.connection, created.id);
  // Step 3: Assert identity, content, completion, creation, and trash state survive
  typia.assert(found);
  TestValidator.equals("trash detail preserves identity", found.id, created.id);
  TestValidator.equals("trash detail preserves content", found.description, "Retained detail");
  TestValidator.equals("trash detail reports trashed state", found.availability, "trashed");
  TestValidator.equals("trash detail preserves completion", found.completion, created.completion);
  TestValidator.equals("trash detail preserves creation time", found.createdAt, created.createdAt);
  TestValidator.predicate("trash detail reports the trash timestamp", found.trashedAt !== null);
}

/**
 * Proves restoration returns the same Todo to active work without history changes.
 *
 * 1. Join an account, create a Todo, move it to trash, and capture its history.
 * 2. Restore the Todo through the trash operation.
 * 3. Observe active, trash, and history surfaces and assert the same task returned.
 */
export async function test_api_todo_restore(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account, create a Todo, move it to trash, and capture its history
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { description: "Recover me" });
  await api.functional.todo.user.todo.trash(user.connection, created.id);
  const before = await api.functional.todo.user.todo.history(user.connection, created.id);
  const trashed = await api.functional.todo.user.trash.at(user.connection, created.id);
  // Step 2: Restore the Todo through the trash operation
  const restored = await api.functional.todo.user.trash.restore(user.connection, created.id);
  // Step 3: Observe active, trash, and history surfaces and assert the same task returned
  typia.assert(restored);
  TestValidator.equals("restore preserves identity", restored.id, created.id);
  TestValidator.equals("restore returns active state", restored.availability, "active");
  TestValidator.equals("restore preserves description", restored.description, trashed.description);
  TestValidator.equals("restore preserves creation time", restored.createdAt, trashed.createdAt);
  TestValidator.equals("restore clears active trash visibility", restored.trashedAt, trashed.trashedAt);
  const after = await api.functional.todo.user.todo.history(user.connection, created.id);
  TestValidator.equals("restore preserves complete history", after.length, before.length);
  TestValidator.equals("restore makes the same Todo active again", (await api.functional.todo.user.todo.at(user.connection, created.id)).id, created.id);
  TestValidator.equals("restore removes the Todo from trash", (await api.functional.todo.user.trash.index(user.connection, {})).pagination.records, 0);
}

/**
 * Proves permanent trash deletion removes the Todo and its history.
 *
 * 1. Join an account, edit a Todo, and move it to trash.
 * 2. Permanently erase it through the trash operation.
 * 3. Assert trash detail and history are both unavailable.
 */
export async function test_api_todo_trash_erase(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account, edit a Todo, and move it to trash
  const user = await joinUser(connection);
  const created = await createTodo(user.connection);
  await api.functional.todo.user.todo.update(user.connection, created.id, { version: created.version, title: "Edited before erase" });
  await api.functional.todo.user.todo.trash(user.connection, created.id);
  // Step 2: Permanently erase it through the trash operation
  const result = await api.functional.todo.user.trash.erase(user.connection, created.id);
  // Step 3: Assert trash detail and history are both unavailable
  typia.assert(result);
  await TestValidator.error("permanently deleted Todo leaves trash", () => api.functional.todo.user.trash.at(user.connection, created.id));
  await TestValidator.error("permanently deleted Todo leaves no history", () => api.functional.todo.user.todo.history(user.connection, created.id));
}

/**
 * Proves trash pagination reports totals and preserves newest-trash ordering.
 *
 * 1. Join an account, create two Todos, and trash them in sequence.
 * 2. Browse trash with one-item pagination.
 * 3. Assert totals, page size, newest-first ordering, and page validation.
 */
export async function test_api_todo_trash_pagination(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account, create two Todos, and trash them in sequence
  const user = await joinUser(connection);
  const first = await createTodo(user.connection, { title: "First trashed" });
  const second = await createTodo(user.connection, { title: "Second trashed" });
  await api.functional.todo.user.todo.trash(user.connection, first.id);
  await api.functional.todo.user.todo.trash(user.connection, second.id);
  // Step 2: Browse trash with one-item pagination
  const page = await api.functional.todo.user.trash.index(user.connection, { page: 1, limit: 1 });
  // Step 3: Assert totals, page size, newest-first ordering, and page validation
  typia.assert(page);
  TestValidator.equals("trash reports complete totals", page.pagination.records, 2);
  TestValidator.equals("trash uses the requested page size", page.data.length, 1);
  TestValidator.equals("trash is newest deletion first", page.data[0]?.id, second.id);
  await TestValidator.error("trash page zero is refused", () => api.functional.todo.user.trash.index(user.connection, { page: 0 as api.IPage.IRequest["page"] }));
}
