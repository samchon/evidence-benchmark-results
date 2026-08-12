import * as api from "@benchmark/todo-api";
import { TestValidator } from "@nestia/e2e";

import { createTodo, joinUser } from "../../../helpers/TodoSetup";

/**
 * Proves protected profile, Todo, history, and trash surfaces require a session.
 *
 * 1. Create an anonymous connection with only the test host.
 * 2. Call each protected profile, Todo, and trash surface.
 * 3. Assert every call is refused without authentication.
 */
export async function test_api_todo_ownership_requires_authentication(connection: api.IConnection): Promise<void> {
  // Step 1: Create an anonymous connection with only the test host
  const anonymous: api.IConnection = { host: connection.host };
  // Step 2: Call each protected profile, Todo, and trash surface
  await TestValidator.error("anonymous profile view is refused", () => api.functional.todo.user.profile.at(anonymous));
  await TestValidator.error("anonymous Todo creation is refused", () => api.functional.todo.user.todo.create(anonymous, { title: "No session" }));
  await TestValidator.error("anonymous active list is refused", () => api.functional.todo.user.todo.index(anonymous, {}));
  // Step 3: Assert every call is refused without authentication
  await TestValidator.error("anonymous trash list is refused", () => api.functional.todo.user.trash.index(anonymous, {}));
}

/**
 * Proves another account cannot read or change any Todo state.
 *
 * 1. Join two accounts and create a Todo for the first account.
 * 2. Attempt every active read/change/history operation as the second account.
 * 3. Read the owner's Todo and history and assert no cross-account effect occurred.
 */
export async function test_api_todo_ownership_refuses_cross_account_access(connection: api.IConnection): Promise<void> {
  // Step 1: Join two accounts and create a Todo for the first account
  const owner = await joinUser(connection);
  const other = await joinUser(connection);
  const ownerProfile = await api.functional.todo.user.profile.at(owner.connection);
  const otherProfile = await api.functional.todo.user.profile.at(other.connection);
  if (ownerProfile.id === otherProfile.id) throw new Error("Separate accounts shared a profile identity.");
  const todo = await createTodo(owner.connection, { description: "Private detail" });
  // Step 2: Attempt every active read/change/history operation as the second account
  await TestValidator.error("other account cannot read active detail", () => api.functional.todo.user.todo.at(other.connection, todo.id));
  await TestValidator.error("other account cannot edit content", () => api.functional.todo.user.todo.update(other.connection, todo.id, { version: todo.version, title: "Stolen" }));
  await TestValidator.error("other account cannot complete the Todo", () => api.functional.todo.user.todo.complete(other.connection, todo.id));
  await TestValidator.error("other account cannot trash the Todo", () => api.functional.todo.user.todo.trash(other.connection, todo.id));
  await TestValidator.error("other account cannot read history", () => api.functional.todo.user.todo.history(other.connection, todo.id));
  const list = await api.functional.todo.user.todo.index(other.connection, {});
  // Step 3: Read the owner's Todo and history and assert no cross-account effect occurred
  if (list.data.some((item) => item.id === todo.id)) throw new Error("The active list crossed the ownership boundary.");
  const ownerView = await api.functional.todo.user.todo.at(owner.connection, todo.id);
  if (ownerView.title !== todo.title) throw new Error("A cross-account attempt changed the owner's Todo.");
  if (ownerView.description !== todo.description || ownerView.completion !== todo.completion || ownerView.availability !== todo.availability)
    throw new Error("A cross-account attempt changed the owner's Todo state.");
  TestValidator.equals("cross-account attempts create no history", (await api.functional.todo.user.todo.history(owner.connection, todo.id)).length, 0);
}

/**
 * Proves ownership is enforced across every trash recovery command.
 *
 * 1. Join two accounts, create a Todo for the owner, and move it to trash.
 * 2. Attempt trash detail, restore, erase, and list access as the other account.
 * 3. Read the owner's trash detail and assert the task stayed unchanged.
 */
export async function test_api_todo_ownership_refuses_cross_account_trash(connection: api.IConnection): Promise<void> {
  // Step 1: Join two accounts, create a Todo for the owner, and move it to trash
  const owner = await joinUser(connection);
  const other = await joinUser(connection);
  const todo = await createTodo(owner.connection);
  await api.functional.todo.user.todo.trash(owner.connection, todo.id);
  // Step 2: Attempt trash detail, restore, erase, and list access as the other account
  await TestValidator.error("other account cannot read trash detail", () => api.functional.todo.user.trash.at(other.connection, todo.id));
  await TestValidator.error("other account cannot restore a Todo", () => api.functional.todo.user.trash.restore(other.connection, todo.id));
  await TestValidator.error("other account cannot erase a Todo", () => api.functional.todo.user.trash.erase(other.connection, todo.id));
  const list = await api.functional.todo.user.trash.index(other.connection, {});
  // Step 3: Read the owner's trash detail and assert the task stayed unchanged
  if (list.data.some((item) => item.id === todo.id)) throw new Error("The trash list crossed the ownership boundary.");
  const ownerView = await api.functional.todo.user.trash.at(owner.connection, todo.id);
  if (ownerView.id !== todo.id || ownerView.availability !== "trashed") throw new Error("A cross-account attempt changed trash state.");
}

/**
 * Proves active-only and trash-only operations refuse an ineligible state.
 *
 * 1. Join an account and move an active Todo into trash.
 * 2. Attempt active-only operations, restore it, then attempt trash-only operations.
 * 3. Assert each state-ineligible command is refused.
 */
export async function test_api_todo_ownership_refuses_ineligible_states(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and move an active Todo into trash
  const user = await joinUser(connection);
  const todo = await createTodo(user.connection);
  await api.functional.todo.user.todo.trash(user.connection, todo.id);
  // Step 2: Attempt active-only operations, restore it, then attempt trash-only operations
  await TestValidator.error("active detail refuses a trashed Todo", () => api.functional.todo.user.todo.at(user.connection, todo.id));
  await TestValidator.error("active edit refuses a trashed Todo", () => api.functional.todo.user.todo.update(user.connection, todo.id, { version: todo.version, title: "Too late" }));
  await TestValidator.error("completion refuses a trashed Todo", () => api.functional.todo.user.todo.complete(user.connection, todo.id));
  await TestValidator.error("a Todo cannot be trashed twice", () => api.functional.todo.user.todo.trash(user.connection, todo.id));
  await api.functional.todo.user.trash.restore(user.connection, todo.id);
  // Step 3: Assert each state-ineligible command is refused
  await TestValidator.error("trash detail refuses an active Todo", () => api.functional.todo.user.trash.at(user.connection, todo.id));
  await TestValidator.error("restore refuses an active Todo", () => api.functional.todo.user.trash.restore(user.connection, todo.id));
  await TestValidator.error("erase refuses an active Todo", () => api.functional.todo.user.trash.erase(user.connection, todo.id));
}
