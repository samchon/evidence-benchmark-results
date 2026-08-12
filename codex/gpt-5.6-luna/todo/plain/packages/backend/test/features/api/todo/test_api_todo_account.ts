import * as api from "@benchmark/todo-api";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import { createTodo, joinUser } from "../../../helpers/TodoSetup";

/**
 * Proves viewing the private profile returns only the current owner.
 *
 * 1. Join an account.
 * 2. Read its private profile.
 * 3. Assert the profile identity and display name belong to that account.
 */
export async function test_api_todo_profile_at(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account
  const user = await joinUser(connection);
  // Step 2: Read its private profile
  const profile = await api.functional.todo.user.profile.at(user.connection);
  // Step 3: Assert the profile identity and display name belong to that account
  typia.assert(profile);
  TestValidator.equals("profile belongs to joined account", profile.id, user.authorized.user.id);
  TestValidator.equals("profile exposes the joined display name", profile.displayName, "Private Owner");
}

/**
 * Proves profile editing changes only the private display name.
 *
 * 1. Join an account and replace its display name.
 * 2. Read the profile and log in again.
 * 3. Assert the name changed while profile/account identity remained stable.
 */
export async function test_api_todo_profile_update(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and replace its display name
  const user = await joinUser(connection);
  const updated = await api.functional.todo.user.profile.update(user.connection, { displayName: "Renamed Owner" });
  // Step 2: Read the profile and log in again
  typia.assert(updated);
  TestValidator.equals("profile name is replaced", updated.displayName, "Renamed Owner");
  const current = await api.functional.todo.user.profile.at(user.connection);
  TestValidator.equals("profile update is visible on a later read", current.displayName, "Renamed Owner");
  const logged = await api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: user.password });
  // Step 3: Assert the name changed while profile/account identity remained stable
  TestValidator.equals("profile update preserves account identity", logged.user.id, user.authorized.user.id);
}

/**
 * Proves current-session logout removes only the current session authority.
 *
 * 1. Join an account and create a second login session.
 * 2. Log out the first session.
 * 3. Assert the first session is refused while the second remains usable.
 */
export async function test_api_todo_logout(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a second login session
  const user = await joinUser(connection);
  const other: api.IConnection = { host: connection.host };
  await api.functional.todo.auth.user.login(other, { email: user.email, password: user.password });
  // Step 2: Log out the first session
  const result = await api.functional.todo.user.logout(user.connection);
  // Step 3: Assert the first session is refused while the second remains usable
  typia.assert(result);
  await TestValidator.error("logged-out session cannot view profile", () => api.functional.todo.user.profile.at(user.connection));
  const profile = await api.functional.todo.user.profile.at(other);
  typia.assert(profile);
}

/**
 * Proves all-session logout invalidates every session of the account.
 *
 * 1. Join an account and create a second login session.
 * 2. End all sessions from the first connection.
 * 3. Assert the other session can no longer view the private profile.
 */
export async function test_api_todo_logout_all(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a second login session
  const user = await joinUser(connection);
  const other: api.IConnection = { host: connection.host };
  await api.functional.todo.auth.user.login(other, { email: user.email, password: user.password });
  // Step 2: End all sessions from the first connection
  const result = await api.functional.todo.user.logout_all.logoutAll(user.connection);
  // Step 3: Assert the other session can no longer view the private profile
  typia.assert(result);
  await TestValidator.error("other session is also invalidated", () => api.functional.todo.user.profile.at(other));
}

/**
 * Proves password replacement accepts the new secret and ends old sessions.
 *
 * 1. Join an account and replace its password.
 * 2. Log in with the new password.
 * 3. Assert the old password and pre-change session are refused.
 */
export async function test_api_todo_password_change(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and replace its password
  const user = await joinUser(connection);
  const result = await api.functional.todo.user.password.changePassword(user.connection, { currentPassword: user.password, newPassword: "new correct password" });
  // Step 2: Log in with the new password
  typia.assert(result);
  const logged: api.IConnection = { host: connection.host };
  const authorized = await api.functional.todo.auth.user.login(logged, { email: user.email, password: "new correct password" });
  // Step 3: Assert the old password and pre-change session are refused
  typia.assert(authorized);
  await TestValidator.error("old password is rejected after replacement", () => api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: user.password }));
  await TestValidator.error("old session ends after password replacement", () => api.functional.todo.user.profile.at(user.connection));
}

/**
 * Proves password replacement requires the old proof and a different valid secret.
 *
 * 1. Join an account and create another valid session.
 * 2. Attempt password changes with wrong, reused, and short values.
 * 3. Assert the old credential and both sessions remain usable.
 */
export async function test_api_todo_password_change_rejections(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create another valid session
  const user = await joinUser(connection);
  const other: api.IConnection = { host: connection.host };
  await api.functional.todo.auth.user.login(other, { email: user.email, password: user.password });
  // Step 2: Attempt password changes with wrong, reused, and short values
  await TestValidator.error("incorrect current password is refused", () => api.functional.todo.user.password.changePassword(user.connection, { currentPassword: "incorrect password", newPassword: "new correct password" }));
  await TestValidator.error("reusing the current password is refused", () => api.functional.todo.user.password.changePassword(user.connection, { currentPassword: user.password, newPassword: user.password }));
  await TestValidator.error("short replacement password is refused", () => api.functional.todo.user.password.changePassword(user.connection, { currentPassword: user.password, newPassword: "short" }));
  // Step 3: Assert the old credential and both sessions remain usable
  const profile = await api.functional.todo.user.profile.at(user.connection);
  typia.assert(profile);
  const otherProfile = await api.functional.todo.user.profile.at(other);
  typia.assert(otherProfile);
  await api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: user.password });
}

/**
 * Proves terminal account deletion removes login authority and owned access.
 *
 * 1. Join an account, create active/trash Todos, and create edit history.
 * 2. Delete the account with its current password.
 * 3. Assert login, the old session, and both former Todo states are unavailable.
 */
export async function test_api_todo_account_delete(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account, create active/trash Todos, and create edit history
  const user = await joinUser(connection);
  const todo = await createTodo(user.connection, { description: "Will be cascaded" });
  const activeTodo = await createTodo(user.connection, { title: "Active at deletion" });
  await api.functional.todo.user.todo.update(user.connection, todo.id, { version: todo.version, title: "Edited before account deletion" });
  await api.functional.todo.user.todo.trash(user.connection, todo.id);
  // Step 2: Delete the account with its current password
  const result = await api.functional.todo.user.account._delete.deleteAccount(user.connection, { currentPassword: user.password });
  // Step 3: Assert login, the old session, and both former Todo states are unavailable
  typia.assert(result);
  await TestValidator.error("deleted account cannot log in", () => api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: user.password }));
  await TestValidator.error("deleted account has no remaining Todo detail", () => api.functional.todo.user.trash.at(user.connection, todo.id));
  await TestValidator.error("deleted account cannot use its former access session", () => api.functional.todo.user.profile.at(user.connection));
  await TestValidator.error("deleted account cannot access its former active Todo", () => api.functional.todo.user.todo.at(user.connection, activeTodo.id));
}

/**
 * Proves a wrong terminal password preserves the account and its session.
 *
 * 1. Join an account and create a Todo with its current history.
 * 2. Attempt account deletion with a wrong password.
 * 3. Read profile, Todo, history, and login and assert all prior state remains.
 */
export async function test_api_todo_account_delete_rejects_wrong_password(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with its current history
  const user = await joinUser(connection);
  const todo = await createTodo(user.connection, { description: "Must remain" });
  const beforeHistory = await api.functional.todo.user.todo.history(user.connection, todo.id);
  // Step 2: Attempt account deletion with a wrong password
  await TestValidator.error("wrong deletion password is refused", () => api.functional.todo.user.account._delete.deleteAccount(user.connection, { currentPassword: "wrong password" }));
  // Step 3: Read profile, Todo, history, and login and assert all prior state remains
  const profile = await api.functional.todo.user.profile.at(user.connection);
  typia.assert(profile);
  const current = await api.functional.todo.user.todo.at(user.connection, todo.id);
  TestValidator.equals("wrong deletion preserves the Todo", current.id, todo.id);
  TestValidator.equals("wrong deletion preserves Todo content", current.description, todo.description);
  const afterHistory = await api.functional.todo.user.todo.history(user.connection, todo.id);
  TestValidator.equals("wrong deletion preserves history", afterHistory.length, beforeHistory.length);
  await api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: user.password });
}
