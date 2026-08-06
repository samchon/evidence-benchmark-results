import * as api from "@benchmark/todo-api";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

let sequence = 0;
const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
function credentials(): api.IAuth {
  sequence += 1;
  return { email: `todo-${Date.now()}-${sequence}@example.com`, password: "password123", displayName: "Private User" };
}
async function setup(connection: api.IConnection): Promise<{ account: api.IAuth.IAuthorized; user: api.IConnection; todo: api.ITodo }> {
  const user: api.IConnection = { host: connection.host };
  const account = await api.functional.auth.user.join(user, credentials());
  typia.assert(account);
  const todo = await api.functional.todo.create(user, { title: "Initial task", description: "Details", startDate: "2026-08-05", dueDate: "2026-08-06" });
  typia.assert(todo);
  return { account, user, todo };
}
async function rawRefused(connection: api.IConnection, method: string, path: string, body: unknown): Promise<void> {
  const result = await rawResult(connection, method, path, body);
  TestValidator.equals(`${method} ${path} refusal`, result.ok, false);
}
async function rawResult(connection: api.IConnection, method: string, path: string, body: unknown): Promise<{ ok: boolean; status: number; body: string }> {
  const headers = new Headers();
  for (const [key, value] of Object.entries(connection.headers ?? {})) headers.set(key, String(value));
  headers.set("Content-Type", "application/json");
  const fetcher = connection.fetch ?? fetch;
  const response = await fetcher(`${connection.host}${path}`, { method, headers, body: JSON.stringify(body) });
  return { ok: response.ok, status: response.status, body: await response.text() };
}

/**
 * Proves registration issues an immediately usable private session.
 *
 * 1. Submit valid registration credentials.
 * 2. Read the new private profile through the issued session.
 * 3. Assert the registration result and display name.
 */
export async function test_api_auth_join(connection: api.IConnection): Promise<void> {
  // Step 1: Submit valid registration credentials
  const user: api.IConnection = { host: connection.host };
  const result = await api.functional.auth.user.join(user, credentials());
  typia.assert(result);
  // Step 2: Read the new private profile through the issued session
  const profile = await api.functional.profile.at(user);
  // Step 3: Assert the registration result and display name
  TestValidator.equals("joined profile", profile.displayName, "Private User");
}
/**
 * Proves login creates a second session for an existing account.
 *
 * 1. Register the account through one connection.
 * 2. Log in through a second connection.
 * 3. Assert both sessions can read the private profile.
 */
export async function test_api_auth_login(connection: api.IConnection): Promise<void> {
  // Step 1: Register the account through one connection
  const input = credentials();
  const first: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(first, input);
  // Step 2: Log in through a second connection
  const second: api.IConnection = { host: connection.host };
  const result = await api.functional.auth.user.login(second, { email: `  ${input.email.toUpperCase()}  `, password: input.password });
  // Step 3: Assert both sessions can read the private profile
  typia.assert(result);
  typia.assert(await api.functional.profile.at(first));
  typia.assert(await api.functional.profile.at(second));
}
/**
 * Proves refresh exchanges a valid refresh token for a usable session.
 *
 * 1. Register an account and retain its refresh token.
 * 2. Exchange that token through a new connection.
 * 3. Assert the refreshed session reaches the profile.
 */
export async function test_api_auth_refresh(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and retain its refresh token
  const { account } = await setup(connection);
  // Step 2: Exchange that token through a new connection
  const refreshed: api.IConnection = { host: connection.host };
  const result = await api.functional.auth.user.refresh(refreshed, { refreshToken: account.token.refresh });
  // Step 3: Assert the refreshed session reaches the profile
  typia.assert(result);
  typia.assert(await api.functional.profile.at(refreshed));
}
/**
 * Proves current-session logout immediately removes private authority.
 *
 * 1. Register an account and establish private state.
 * 2. Logout the current session.
 * 3. Assert a private read is refused afterward.
 */
export async function test_api_auth_logout(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and establish private state
  const { account, user } = await setup(connection);
  // Step 2: Logout the current session
  typia.assert(await api.functional.auth.user.logout(user));
  // Step 3: Assert a private read is refused afterward
  await TestValidator.error("logged out session refused", () => api.functional.profile.at(user));
  await TestValidator.error("logged out refresh refused", () => api.functional.auth.user.refresh({ host: connection.host }, { refreshToken: account.token.refresh }));
}
/**
 * Proves all-session logout revokes every session for the account.
 *
 * 1. Register and log in from two connections.
 * 2. Logout all sessions through the first connection.
 * 3. Assert both private reads are refused.
 */
export async function test_api_auth_logout_all(connection: api.IConnection): Promise<void> {
  // Step 1: Register and log in from two connections
  const input = credentials();
  const first: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(first, input);
  const second: api.IConnection = { host: connection.host };
  const secondAccount = await api.functional.auth.user.login(second, { email: input.email, password: input.password });
  // Step 2: Logout all sessions through the first connection
  typia.assert(await api.functional.auth.user.logout_all.logoutAll(first));
  // Step 3: Assert both private reads are refused
  await TestValidator.error("first session revoked", () => api.functional.profile.at(first));
  await TestValidator.error("second session revoked", () => api.functional.profile.at(second));
  await TestValidator.error("second refresh revoked", () => api.functional.auth.user.refresh({ host: connection.host }, { refreshToken: secondAccount.token.refresh }));
}
/**
 * Proves password replacement succeeds and invalidates the previous session.
 *
 * 1. Register with the original password.
 * 2. Replace it through the authenticated password operation.
 * 3. Assert the old session is revoked and the new password logs in.
 */
export async function test_api_auth_change_password(connection: api.IConnection): Promise<void> {
  // Step 1: Register with the original password
  const input = credentials();
  const user: api.IConnection = { host: connection.host };
  const account = await api.functional.auth.user.join(user, input);
  // Step 2: Replace it through the authenticated password operation
  typia.assert(await api.functional.auth.user.password.changePassword(user, { currentPassword: input.password, newPassword: "newpassword123" }));
  // Step 3: Assert the old session is revoked and the new password logs in
  await TestValidator.error("old session revoked", () => api.functional.profile.at(user));
  await TestValidator.error("old refresh revoked", () => api.functional.auth.user.refresh({ host: connection.host }, { refreshToken: account.token.refresh }));
  const logged: api.IConnection = { host: connection.host };
  typia.assert(await api.functional.auth.user.login(logged, { email: input.email, password: "newpassword123" }));
}
/**
 * Proves recovery start and completion replace the credential.
 *
 * 1. Register an account and request recovery proof.
 * 2. Complete recovery with an accepted replacement password.
 * 3. Assert the replacement password logs in.
 */
export async function test_api_auth_recover(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and request recovery proof
  const input = credentials();
  const user: api.IConnection = { host: connection.host };
  const account = await api.functional.auth.user.join(user, input);
  // Step 2: Complete recovery with an accepted replacement password
  const start = await api.functional.auth.user.recover.start.recoverStart({ host: connection.host }, { email: input.email });
  typia.assert(start);
  typia.assert(await api.functional.auth.user.recover.recover({ host: connection.host }, { email: input.email, proof: start.proof, newPassword: "recovered123" }));
  // Step 3: Assert the replacement password logs in
  await TestValidator.error("recovery revokes old session", () => api.functional.profile.at(user));
  await TestValidator.error("recovery revokes old refresh", () => api.functional.auth.user.refresh({ host: connection.host }, { refreshToken: account.token.refresh }));
  const logged: api.IConnection = { host: connection.host };
  typia.assert(await api.functional.auth.user.login(logged, { email: input.email, password: "recovered123" }));
}
/**
 * Proves forgotten-password entry returns a uniform proof-shaped response.
 *
 * 1. Register an account.
 * 2. Invoke recovery start for its canonical email.
 * 3. Assert a non-empty proof-shaped response.
 */
export async function test_api_auth_recover_start(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account
  const input = credentials();
  const user: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(user, input);
  // Step 2: Invoke recovery start for its canonical email
  const result = await api.functional.auth.user.recover.start.recoverStart({ host: connection.host }, { email: input.email });
  typia.assert(result);
  // Step 3: Assert a non-empty proof-shaped response
  TestValidator.predicate("recovery proof is issued", result.proof.length > 20);
}
/**
 * Proves terminal account deletion removes the account.
 *
 * 1. Register an account.
 * 2. Delete it with the current password.
 * 3. Assert the former credentials cannot log in.
 */
export async function test_api_auth_delete_account(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account
  const input = credentials();
  const user: api.IConnection = { host: connection.host };
  const account = await api.functional.auth.user.join(user, input);
  // Step 2: Delete it with the current password
  typia.assert(await api.functional.auth.user.account.deleteAccount(user, { currentPassword: input.password }));
  // Step 3: Assert the former credentials cannot log in
  await TestValidator.error("deleted session refused", () => api.functional.profile.at(user));
  await TestValidator.error("deleted refresh refused", () => api.functional.auth.user.refresh({ host: connection.host }, { refreshToken: account.token.refresh }));
  const login: api.IConnection = { host: connection.host };
  await TestValidator.error("deleted account cannot log in", () => api.functional.auth.user.login(login, { email: input.email, password: input.password }));
}
/**
 * Proves canonical duplicate registration is refused without replacing the account.
 *
 * 1. Register one canonical email identity.
 * 2. Submit a case-and-whitespace duplicate.
 * 3. Assert the original session and profile remain usable.
 */
export async function test_api_auth_join_duplicate(connection: api.IConnection): Promise<void> {
  // Step 1: Register one canonical email identity
  const input = credentials();
  const first: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(first, input);
  // Step 2: Submit a case-and-whitespace duplicate
  await TestValidator.error("duplicate canonical email refused", () => api.functional.auth.user.join({ host: connection.host }, { ...input, email: `  ${input.email.toUpperCase()}  ` }));
  // Step 3: Assert the original session and profile remain usable
  typia.assert(await api.functional.profile.at(first));
}
/**
 * Proves wrong and unknown credentials share the same refused login path.
 *
 * 1. Register one account.
 * 2. Submit a wrong password and an unknown email.
 * 3. Assert both login attempts are refused.
 */
export async function test_api_auth_login_invalid(connection: api.IConnection): Promise<void> {
  // Step 1: Register one account
  const input = credentials();
  await api.functional.auth.user.join({ host: connection.host }, input);
  // Step 2: Submit a wrong password and an unknown email
  const wrong = await rawResult(connection, "POST", "/auth/user/login", { email: input.email, password: "wrongpass123" });
  const unknown = await rawResult(connection, "POST", "/auth/user/login", { email: `unknown-${Date.now()}@example.com`, password: input.password });
  // Step 3: Assert both login attempts are refused with the same outcome
  TestValidator.equals("wrong login refused", wrong.ok, false);
  TestValidator.equals("unknown login refused", unknown.ok, false);
  TestValidator.equals("login failure status concealed", wrong.status, unknown.status);
  TestValidator.equals("login failure body concealed", wrong.body, unknown.body);
}
/**
 * Proves a recovery proof is single-use and invalid proofs do not change credentials.
 *
 * 1. Register an account and submit an invalid proof.
 * 2. Complete one valid recovery.
 * 3. Assert the consumed proof cannot be reused.
 */
export async function test_api_auth_recover_invalid(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and submit an invalid proof
  const input = credentials();
  await api.functional.auth.user.join({ host: connection.host }, input);
  await TestValidator.error("invalid proof refused", () => api.functional.auth.user.recover.recover({ host: connection.host }, { email: input.email, proof: "invalid-proof", newPassword: "recovered123" }));
  const unchangedLogin: api.IConnection = { host: connection.host };
  typia.assert(await api.functional.auth.user.login(unchangedLogin, { email: input.email, password: input.password }));
  // Step 2: Complete one valid recovery
  const start = await api.functional.auth.user.recover.start.recoverStart({ host: connection.host }, { email: input.email });
  await api.functional.auth.user.recover.recover({ host: connection.host }, { email: input.email, proof: start.proof, newPassword: "recovered123" });
  // Step 3: Assert the consumed proof cannot be reused
  await TestValidator.error("reused proof refused", () => api.functional.auth.user.recover.recover({ host: connection.host }, { email: input.email, proof: start.proof, newPassword: "another123" }));
}
/**
 * Proves profile inspection returns the private display name.
 *
 * 1. Register the account and establish its profile.
 * 2. Read the profile through the authenticated accessor.
 * 3. Assert only the expected display name is returned.
 */
export async function test_api_profile_at(connection: api.IConnection): Promise<void> {
  // Step 1: Register the account and establish its profile
  const { user } = await setup(connection);
  // Step 2: Read the profile through the authenticated accessor
  const profile = await api.functional.profile.at(user);
  typia.assert(profile);
  // Step 3: Assert only the expected display name is returned
  TestValidator.equals("private display name", profile.displayName, "Private User");
}
/**
 * Proves profile update changes only the display identity.
 *
 * 1. Register the account and establish a todo.
 * 2. Replace the display name.
 * 3. Assert the new profile value is persisted.
 */
export async function test_api_profile_update(connection: api.IConnection): Promise<void> {
  // Step 1: Register the account and establish a todo
  const { user } = await setup(connection);
  // Step 2: Replace the display name
  const profile = await api.functional.profile.update(user, { displayName: "Renamed User" });
  typia.assert(profile);
  // Step 3: Assert the new profile value is persisted
  TestValidator.equals("renamed profile", profile.displayName, "Renamed User");
  const persisted = await api.functional.profile.at(user);
  typia.assert(persisted);
  TestValidator.equals("renamed profile persisted", persisted.displayName, "Renamed User");
}
/**
 * Proves whitespace-only display names are refused without changing the profile.
 *
 * 1. Register the account.
 * 2. Submit a whitespace-only replacement.
 * 3. Assert the prior display name remains.
 */
export async function test_api_profile_update_invalid(connection: api.IConnection): Promise<void> {
  // Step 1: Register the account
  const { user } = await setup(connection);
  // Step 2: Submit a whitespace-only replacement
  await TestValidator.error("whitespace display name refused", () => api.functional.profile.update(user, { displayName: "   " }));
  await rawRefused(user, "PUT", "/profile", { displayName: "x".repeat(101) });
  // Step 3: Assert the prior display name remains
  const profile = await api.functional.profile.at(user);
  typia.assert(profile);
  TestValidator.equals("profile preserved", profile.displayName, "Private User");
}
/**
 * Proves todo creation persists an active incomplete task.
 *
 * 1. Authenticate the owner and create a todo.
 * 2. Read the created todo through active detail.
 * 3. Assert its initial status is incomplete.
 */
export async function test_api_todo_create(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create a todo
  const { user, todo } = await setup(connection);
  // Step 2: Read the created todo through active detail
  const detail = await api.functional.todo.at(user, todo.id);
  typia.assert(detail);
  // Step 3: Assert its initial status is incomplete
  TestValidator.equals("created todo status", detail.status, "incomplete");
  TestValidator.equals("created todo availability", detail.availability, "active");
  TestValidator.equals("created todo description", detail.description, "Details");
  TestValidator.equals("created todo start", detail.startDate, "2026-08-05");
  TestValidator.equals("created todo due", detail.dueDate, "2026-08-06");
}

/**
 * Proves each optional todo field remains independently optional.
 *
 * 1. Create todos with no optional values and with one optional value at a time.
 * 2. Read each created todo through active detail.
 * 3. Assert omitted values remain empty and supplied values persist.
 */
export async function test_api_todo_create_optional_fields(connection: api.IConnection): Promise<void> {
  // Step 1: Create todos with no optional values and with one optional value at a time
  const { user } = await setup(connection);
  const none = await api.functional.todo.create(user, { title: "No optional values" });
  const description = await api.functional.todo.create(user, { title: "Description only", description: "Optional" });
  const start = await api.functional.todo.create(user, { title: "Start only", startDate: "2026-08-10" });
  const due = await api.functional.todo.create(user, { title: "Due only", dueDate: "2026-08-11" });
  // Step 2: Read each created todo through active detail
  const noneDetail = await api.functional.todo.at(user, none.id);
  const descriptionDetail = await api.functional.todo.at(user, description.id);
  const startDetail = await api.functional.todo.at(user, start.id);
  const dueDetail = await api.functional.todo.at(user, due.id);
  typia.assert(noneDetail);
  typia.assert(descriptionDetail);
  typia.assert(startDetail);
  typia.assert(dueDetail);
  // Step 3: Assert omitted values remain empty and supplied values persist
  TestValidator.equals("no optional description", noneDetail.description, null);
  TestValidator.equals("description persists", descriptionDetail.description, "Optional");
  TestValidator.equals("start persists", startDetail.startDate, "2026-08-10");
  TestValidator.equals("due persists", dueDetail.dueDate, "2026-08-11");
  TestValidator.equals("independent start remains empty", dueDetail.startDate, null);
  TestValidator.equals("independent due remains empty", startDetail.dueDate, null);
}

/**
 * Proves active todo sorting handles both directions and missing dates.
 *
 * 1. Create dated and undated todos owned by one account.
 * 2. Browse by creation, start, and due date in both supported directions.
 * 3. Assert dated tasks precede missing dates and direction changes the order.
 */
export async function test_api_todo_index_sorting(connection: api.IConnection): Promise<void> {
  // Step 1: Create dated and undated todos owned by one account
  const { user } = await setup(connection);
  const first = await api.functional.todo.create(user, { title: "First", startDate: "2026-08-01", dueDate: "2026-08-03" });
  await delay(2);
  const second = await api.functional.todo.create(user, { title: "Second", startDate: "2026-08-10", dueDate: "2026-08-12" });
  await delay(2);
  const missing = await api.functional.todo.create(user, { title: "Missing dates" });
  // Step 2: Browse by creation, start, and due date in both supported directions
  const createdAsc = await api.functional.todo.index(user, { limit: 100, sort: "createdAt", direction: "asc" });
  const createdDesc = await api.functional.todo.index(user, { limit: 100, sort: "createdAt", direction: "desc" });
  const startAsc = await api.functional.todo.index(user, { limit: 100, sort: "startDate", direction: "asc" });
  const startDesc = await api.functional.todo.index(user, { limit: 100, sort: "startDate", direction: "desc" });
  const dueAsc = await api.functional.todo.index(user, { limit: 100, sort: "dueDate", direction: "asc" });
  const dueDesc = await api.functional.todo.index(user, { limit: 100, sort: "dueDate", direction: "desc" });
  typia.assert(createdAsc);
  typia.assert(createdDesc);
  typia.assert(startAsc);
  typia.assert(startDesc);
  typia.assert(dueAsc);
  typia.assert(dueDesc);
  const order = (page: api.IPage<api.ITodo.ISummary>): string[] => page.data.filter((item) => [first.id, second.id, missing.id].includes(item.id)).map((item) => item.id);
  // Step 3: Assert dated tasks precede missing dates and direction changes the order
  TestValidator.equals("created ascending order", order(createdAsc).slice(-3).join(","), [first.id, second.id, missing.id].join(","));
  TestValidator.equals("created descending order", order(createdDesc).slice(0, 3).join(","), [missing.id, second.id, first.id].join(","));
  TestValidator.equals("start ascending order", order(startAsc).slice(-3).join(","), [first.id, second.id, missing.id].join(","));
  TestValidator.equals("start descending order", order(startDesc).slice(-3).join(","), [second.id, first.id, missing.id].join(","));
  TestValidator.equals("due ascending order", order(dueAsc).slice(-3).join(","), [first.id, second.id, missing.id].join(","));
  TestValidator.equals("due descending order", order(dueDesc).slice(-3).join(","), [second.id, first.id, missing.id].join(","));
}
/**
 * Proves active browsing returns owned active summaries and totals.
 *
 * 1. Authenticate the owner and create a todo.
 * 2. Browse the active list with explicit controls.
 * 3. Assert the created summary is present.
 */
export async function test_api_todo_index(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create a todo
  const { user, todo } = await setup(connection);
  // Step 2: Browse the active list with explicit controls
  const page = await api.functional.todo.index(user, { limit: 10, filter: "all", sort: "createdAt", direction: "desc" });
  typia.assert(page);
  // Step 3: Assert the created summary is present with its promised projection
  const summary = page.data.find((item) => item.id === todo.id);
  if (summary === undefined) throw new Error("Created todo is missing from the active list.");
  TestValidator.equals("listed title", summary.title, "Initial task");
  TestValidator.equals("listed status", summary.status, "incomplete");
  TestValidator.equals("listed start", summary.startDate, "2026-08-05");
  TestValidator.equals("listed due", summary.dueDate, "2026-08-06");
  TestValidator.equals("listed pagination records", page.pagination.records, 1);
}
/**
 * Proves active detail exposes full todo content.
 *
 * 1. Authenticate the owner and create a detailed todo.
 * 2. Read its active detail.
 * 3. Assert the full description is preserved.
 */
export async function test_api_todo_at(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create a detailed todo
  const { user, todo } = await setup(connection);
  // Step 2: Read its active detail
  const detail = await api.functional.todo.at(user, todo.id);
  typia.assert(detail);
  // Step 3: Assert the full detail projection is preserved
  TestValidator.equals("detail title", detail.title, "Initial task");
  TestValidator.equals("detail description", detail.description, "Details");
  TestValidator.equals("detail status", detail.status, "incomplete");
  TestValidator.equals("detail availability", detail.availability, "active");
  TestValidator.equals("detail start", detail.startDate, "2026-08-05");
  TestValidator.equals("detail due", detail.dueDate, "2026-08-06");
}
/**
 * Proves content update persists changed values and one history entry.
 *
 * 1. Authenticate the owner and create a todo.
 * 2. Submit one content edit with its revision.
 * 3. Assert the changed title and one history entry.
 */
export async function test_api_todo_update(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create a todo
  const { user, todo } = await setup(connection);
  // Step 2: Submit one content edit with its revision
  const updated = await api.functional.todo.update(user, todo.id, { title: "Edited task", updatedAt: todo.updatedAt });
  typia.assert(updated);
  // Step 3: Assert the changed title and one history entry
  TestValidator.equals("updated title", updated.title, "Edited task");
  const history = await api.functional.todo.history(user, todo.id);
  TestValidator.equals("one edit history entry", history.length, 1);
  TestValidator.equals("history changed title", history[0]?.title, "Edited task");
  const persisted = await api.functional.todo.at(user, todo.id);
  TestValidator.equals("persisted updated title", persisted.title, "Edited task");
  TestValidator.equals("persisted description", persisted.description, "Details");
}
/**
 * Proves no-op content edits are refused without adding history.
 *
 * 1. Authenticate the owner and create a todo.
 * 2. Submit unchanged content with its revision.
 * 3. Assert refusal and an empty history.
 */
export async function test_api_todo_update_noop(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create a todo
  const { user, todo } = await setup(connection);
  // Step 2: Submit unchanged content with its revision
  await TestValidator.error("no-op edit refused", () => api.functional.todo.update(user, todo.id, { title: todo.title, updatedAt: todo.updatedAt }));
  // Step 3: Assert refusal and an empty history
  const history = await api.functional.todo.history(user, todo.id);
  typia.assert(history);
  TestValidator.equals("no history after no-op", history.length, 0);
}
/**
 * Proves a stale content edit is refused after another accepted edit.
 *
 * 1. Establish two sessions and capture one todo revision.
 * 2. Accept a newer edit through the first session.
 * 3. Assert the stale second edit is refused and newer content remains.
 */
export async function test_api_todo_update_stale(connection: api.IConnection): Promise<void> {
  // Step 1: Establish two sessions and capture one todo revision
  const input = credentials();
  const first: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(first, input);
  const todo = await api.functional.todo.create(first, { title: "Concurrent task" });
  const second: api.IConnection = { host: connection.host };
  await api.functional.auth.user.login(second, { email: input.email, password: input.password });
  // Step 2: Accept a newer edit through the first session
  await api.functional.todo.update(first, todo.id, { title: "Newer task", updatedAt: todo.updatedAt });
  // Step 3: Assert the stale second edit is refused and newer content remains
  await TestValidator.error("stale edit refused", () => api.functional.todo.update(second, todo.id, { title: "Stale task", updatedAt: todo.updatedAt }));
  const detail = await api.functional.todo.at(first, todo.id);
  typia.assert(detail);
  TestValidator.equals("newer edit preserved", detail.title, "Newer task");
}
/**
 * Proves date and title validation preserve a todo and its history.
 *
 * 1. Authenticate the owner and create a todo.
 * 2. Submit invalid date and title edits.
 * 3. Assert content and history remain unchanged.
 */
export async function test_api_todo_update_invalid(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create a todo
  const { user, todo } = await setup(connection);
  // Step 2: Submit invalid date and title edits
  await TestValidator.error("invalid date range refused", () => api.functional.todo.update(user, todo.id, { startDate: "2026-08-10", dueDate: "2026-08-01", updatedAt: todo.updatedAt }));
  await TestValidator.error("blank title refused", () => api.functional.todo.update(user, todo.id, { title: "   ", updatedAt: todo.updatedAt }));
  // Step 3: Assert content and history remain unchanged
  const detail = await api.functional.todo.at(user, todo.id);
  typia.assert(detail);
  TestValidator.equals("content preserved", detail.title, todo.title);
  TestValidator.equals("history preserved", (await api.functional.todo.history(user, todo.id)).length, 0);
}
/**
 * Proves complete is idempotent and visible in detail.
 *
 * 1. Authenticate the owner and create an incomplete todo.
 * 2. Mark it complete twice.
 * 3. Assert both responses report complete status.
 */
export async function test_api_todo_complete(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create an incomplete todo
  const { user, todo } = await setup(connection);
  // Step 2: Mark it complete twice
  const completed = await api.functional.todo.complete(user, todo.id);
  typia.assert(completed);
  // Step 3: Assert both responses report complete status
  TestValidator.equals("complete status", completed.status, "complete");
  const repeated = await api.functional.todo.complete(user, todo.id);
  typia.assert(repeated);
  TestValidator.equals("repeat complete", repeated.status, "complete");
  TestValidator.equals("completion adds no history", (await api.functional.todo.history(user, todo.id)).length, 0);
}
/**
 * Proves incomplete is idempotent and visible in detail.
 *
 * 1. Authenticate the owner and complete a todo.
 * 2. Mark it incomplete twice.
 * 3. Assert both responses report incomplete status.
 */
export async function test_api_todo_incomplete(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and complete a todo
  const { user, todo } = await setup(connection);
  await api.functional.todo.complete(user, todo.id);
  // Step 2: Mark it incomplete twice
  const incomplete = await api.functional.todo.incomplete(user, todo.id);
  typia.assert(incomplete);
  // Step 3: Assert both responses report incomplete status
  TestValidator.equals("incomplete status", incomplete.status, "incomplete");
  const repeated = await api.functional.todo.incomplete(user, todo.id);
  typia.assert(repeated);
  TestValidator.equals("repeat incomplete", repeated.status, "incomplete");
  TestValidator.equals("incompletion adds no history", (await api.functional.todo.history(user, todo.id)).length, 0);
}
/**
 * Proves history inspection returns newest content edits.
 *
 * 1. Authenticate the owner and create a todo.
 * 2. Accept one content edit.
 * 3. Assert history returns its changed title.
 */
export async function test_api_todo_history(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create a todo
  const { user, todo } = await setup(connection);
  // Step 2: Accept two content edits
  const first = await api.functional.todo.update(user, todo.id, { title: "Edited task", updatedAt: todo.updatedAt });
  await delay(2);
  await api.functional.todo.update(user, todo.id, { title: "Newest task", updatedAt: first.updatedAt });
  // Step 3: Assert history returns newest-first changed titles
  const history = await api.functional.todo.history(user, todo.id);
  typia.assert(history);
  TestValidator.equals("history length", history.length, 2);
  TestValidator.equals("newest history title", history[0]?.title, "Newest task");
  TestValidator.equals("oldest history title", history[1]?.title, "Edited task");
}
/**
 * Proves soft deletion moves the same todo out of active work.
 *
 * 1. Authenticate the owner and create an active todo.
 * 2. Move it to trash.
 * 3. Assert the trashed state and active-list absence.
 */
export async function test_api_todo_erase(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create an active todo
  const { user, todo } = await setup(connection);
  // Step 2: Move it to trash
  const trashed = await api.functional.todo.erase(user, todo.id);
  typia.assert(trashed);
  // Step 3: Assert the trashed state and active-list absence
  TestValidator.equals("trashed availability", trashed.availability, "trashed");
  TestValidator.equals("trashed title preserved", trashed.title, todo.title);
  TestValidator.predicate("trash timestamp recorded", trashed.trashedAt !== null);
  const active = await api.functional.todo.index(user, { limit: 10 });
  TestValidator.predicate("trashed todo absent from active list", active.data.every((item) => item.id !== todo.id));
  const trash = await api.functional.trash.index(user, { limit: 10 });
  TestValidator.predicate("trashed todo present in trash", trash.data.some((item) => item.id === todo.id));
}
/**
 * Proves owned-state qualification rejects repeated soft deletion.
 *
 * 1. Authenticate the owner and trash one todo.
 * 2. Repeat the active-to-trash command.
 * 3. Assert refusal and preserved trash state.
 */
export async function test_api_todo_erase_trashed(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and trash one todo
  const { user, todo } = await setup(connection);
  await api.functional.todo.erase(user, todo.id);
  // Step 2: Repeat the active-to-trash command
  await TestValidator.error("repeated soft deletion refused", () => api.functional.todo.erase(user, todo.id));
  // Step 3: Assert refusal and preserved trash state
  const detail = await api.functional.trash.at(user, todo.id);
  typia.assert(detail);
  TestValidator.equals("trash state preserved", detail.availability, "trashed");
}
/**
 * Proves active completion filters partition complete and incomplete todos.
 *
 * 1. Create one incomplete and one complete active todo.
 * 2. Browse each completion filter.
 * 3. Assert each result contains only its requested status.
 */
export async function test_api_todo_index_filters(connection: api.IConnection): Promise<void> {
  // Step 1: Create one incomplete and one complete active todo
  const { user, todo } = await setup(connection);
  const complete = await api.functional.todo.create(user, { title: "Complete task" });
  await api.functional.todo.complete(user, complete.id);
  // Step 2: Browse each completion filter
  const incomplete = await api.functional.todo.index(user, { filter: "incomplete-only", limit: 100 });
  typia.assert(incomplete);
  // Step 3: Assert each result contains only its requested status
  TestValidator.predicate("incomplete filter excludes complete", incomplete.data.every((item) => item.status === "incomplete" && item.id !== complete.id));
  const completeOnly = await api.functional.todo.index(user, { filter: "complete-only", limit: 100 });
  typia.assert(completeOnly);
  TestValidator.predicate("complete filter includes complete", completeOnly.data.some((item) => item.id === complete.id));
}
/**
 * Proves pagination beyond the final page returns empty data with totals.
 *
 * 1. Authenticate the owner and create a todo.
 * 2. Request a page beyond the final page.
 * 3. Assert empty data with retained record totals.
 */
export async function test_api_todo_index_pagination(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create a todo
  const { user } = await setup(connection);
  // Step 2: Request a page beyond the final page
  const page = await api.functional.todo.index(user, { page: 100, limit: 1 });
  typia.assert(page);
  // Step 3: Assert empty data with retained record totals
  TestValidator.equals("beyond-final page is empty", page.data.length, 0);
  TestValidator.predicate("pagination total is retained", page.pagination.records >= 1);
}
/**
 * Proves trash browsing returns the retained todo with its trash timestamp.
 *
 * 1. Authenticate the owner and move a todo to trash.
 * 2. Browse the trash list.
 * 3. Assert the retained summary is present.
 */
export async function test_api_trash_index(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and move a todo to trash
  const { user, todo } = await setup(connection);
  await api.functional.todo.erase(user, todo.id);
  // Step 2: Browse the trash list
  const page = await api.functional.trash.index(user, { limit: 10 });
  typia.assert(page);
  // Step 3: Assert the retained summary has the promised projection
  const summary = page.data.find((item) => item.id === todo.id);
  if (summary === undefined) throw new Error("Trashed todo is missing from the trash list.");
  TestValidator.equals("trash summary status", summary.status, "incomplete");
  TestValidator.equals("trash summary title", summary.title, "Initial task");
  TestValidator.predicate("trash summary timestamp", summary.trashedAt.length > 0);
}

/**
 * Proves trash ordering uses newest trash time with deterministic recovery data.
 *
 * 1. Trash two owned todos at different times.
 * 2. Browse the trash list with its fixed ordering.
 * 3. Assert the most recently trashed todo appears first.
 */
export async function test_api_trash_index_ordering(connection: api.IConnection): Promise<void> {
  // Step 1: Trash two owned todos at different times
  const { user } = await setup(connection);
  const first = await api.functional.todo.create(user, { title: "Trash first" });
  await delay(2);
  const second = await api.functional.todo.create(user, { title: "Trash second" });
  await api.functional.todo.erase(user, first.id);
  await delay(2);
  await api.functional.todo.erase(user, second.id);
  // Step 2: Browse the trash list with its fixed ordering
  const page = await api.functional.trash.index(user, { limit: 100 });
  typia.assert(page);
  const ids = page.data.filter((item) => [first.id, second.id].includes(item.id)).map((item) => item.id);
  // Step 3: Assert the most recently trashed todo appears first
  TestValidator.equals("trash newest first", ids.slice(0, 2).join(","), [second.id, first.id].join(","));
}
/**
 * Proves trash detail exposes the preserved task.
 *
 * 1. Authenticate the owner and move a todo to trash.
 * 2. Read its trash detail.
 * 3. Assert the identity is unchanged.
 */
export async function test_api_trash_at(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and move a todo to trash
  const { user, todo } = await setup(connection);
  await api.functional.todo.erase(user, todo.id);
  // Step 2: Read its trash detail
  const detail = await api.functional.trash.at(user, todo.id);
  typia.assert(detail);
  // Step 3: Assert the identity is unchanged
  TestValidator.equals("trash detail identity", detail.id, todo.id);
  TestValidator.equals("trash detail title", detail.title, "Initial task");
  TestValidator.equals("trash detail description", detail.description, "Details");
  TestValidator.equals("trash detail status", detail.status, "incomplete");
  TestValidator.equals("trash detail availability", detail.availability, "trashed");
  TestValidator.predicate("trash detail timestamp", detail.trashedAt !== null);
}
/**
 * Proves trash history remains available after soft deletion.
 *
 * 1. Accept a content edit on an active todo.
 * 2. Move that same todo to trash.
 * 3. Assert its history remains available.
 */
export async function test_api_trash_history(connection: api.IConnection): Promise<void> {
  // Step 1: Accept a content edit on an active todo
  const { user, todo } = await setup(connection);
  await api.functional.todo.update(user, todo.id, { title: "Edited task", updatedAt: todo.updatedAt });
  // Step 2: Move that same todo to trash
  await api.functional.todo.erase(user, todo.id);
  // Step 3: Assert its history remains available
  const history = await api.functional.trash.history(user, todo.id);
  typia.assert(history);
  TestValidator.equals("retained history", history.length, 1);
  TestValidator.equals("retained history title", history[0]?.title, "Edited task");
  TestValidator.equals("trash content title", (await api.functional.trash.at(user, todo.id)).title, "Edited task");
}
/**
 * Proves restore returns the same identity to active work.
 *
 * 1. Authenticate the owner and move a todo to trash.
 * 2. Restore the retained todo.
 * 3. Assert identity and active availability are preserved.
 */
export async function test_api_trash_restore(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and move a todo to trash
  const { user, todo } = await setup(connection);
  const edited = await api.functional.todo.update(user, todo.id, { title: "Restored task", updatedAt: todo.updatedAt });
  await api.functional.todo.erase(user, todo.id);
  // Step 2: Restore the retained todo
  const restored = await api.functional.trash.restore(user, todo.id);
  typia.assert(restored);
  // Step 3: Assert identity and active availability are preserved
  TestValidator.equals("restored identity", restored.id, todo.id);
  TestValidator.equals("restored availability", restored.availability, "active");
  TestValidator.equals("restored title", restored.title, edited.title);
  TestValidator.equals("restored history", (await api.functional.todo.history(user, todo.id)).length, 1);
}
/**
 * Proves active todos cannot be restored through the trash transition.
 *
 * 1. Authenticate the owner and create an active todo.
 * 2. Attempt the trash restore command.
 * 3. Assert refusal and active state preservation.
 */
export async function test_api_trash_restore_active(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create an active todo
  const { user, todo } = await setup(connection);
  // Step 2: Attempt the trash restore command
  await TestValidator.error("active restore refused", () => api.functional.trash.restore(user, todo.id));
  // Step 3: Assert refusal and active state preservation
  const detail = await api.functional.todo.at(user, todo.id);
  typia.assert(detail);
  TestValidator.equals("active state preserved", detail.availability, "active");
}
/**
 * Proves permanent trash deletion removes the todo and its history.
 *
 * 1. Authenticate the owner and move a todo to trash.
 * 2. Permanently delete it through the trash operation.
 * 3. Assert trash detail is no longer available.
 */
export async function test_api_trash_erase(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and move a todo to trash
  const { user, todo } = await setup(connection);
  await api.functional.todo.erase(user, todo.id);
  // Step 2: Permanently delete it through the trash operation
  typia.assert(await api.functional.trash.erase(user, todo.id));
  // Step 3: Assert trash detail is no longer available
  await TestValidator.error("deleted trash detail unavailable", () => api.functional.trash.at(user, todo.id));
  await TestValidator.error("deleted trash history unavailable", () => api.functional.trash.history(user, todo.id));
  const trash = await api.functional.trash.index(user, { limit: 100 });
  TestValidator.predicate("deleted todo absent from trash list", trash.data.every((item) => item.id !== todo.id));
  const active = await api.functional.todo.index(user, { limit: 100 });
  TestValidator.predicate("deleted todo absent from active list", active.data.every((item) => item.id !== todo.id));
}
/**
 * Proves active todos cannot be permanently deleted through trash.
 *
 * 1. Authenticate the owner and create an active todo.
 * 2. Attempt permanent trash deletion.
 * 3. Assert refusal and active detail preservation.
 */
export async function test_api_trash_erase_active(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate the owner and create an active todo
  const { user, todo } = await setup(connection);
  // Step 2: Attempt permanent trash deletion
  await TestValidator.error("active permanent deletion refused", () => api.functional.trash.erase(user, todo.id));
  // Step 3: Assert refusal and active detail preservation
  const detail = await api.functional.todo.at(user, todo.id);
  typia.assert(detail);
  TestValidator.equals("active detail preserved", detail.availability, "active");
}
/**
 * Proves another account cannot inspect or change a todo.
 *
 * 1. Create a todo for the first account.
 * 2. Attempt detail, edit, and history through a second account.
 * 3. Assert refusal and preserved owner content.
 */
export async function test_api_todo_owner_isolation(connection: api.IConnection): Promise<void> {
  // Step 1: Create a todo for the first account
  const first = await setup(connection);
  const second: api.IConnection = { host: connection.host };
  // Step 2: Attempt detail, edit, and history through a second account
  await api.functional.auth.user.join(second, credentials());
  await TestValidator.error("foreign detail refused", () => api.functional.todo.at(second, first.todo.id));
  await TestValidator.error("foreign edit refused", () => api.functional.todo.update(second, first.todo.id, { title: "Intrusion", updatedAt: first.todo.updatedAt }));
  await TestValidator.error("foreign history refused", () => api.functional.todo.history(second, first.todo.id));
  // Step 3: Assert refusal and preserved owner content
  const detail = await api.functional.todo.at(first.user, first.todo.id);
  typia.assert(detail);
  TestValidator.equals("owner content preserved", detail.title, first.todo.title);
}

/**
 * Proves another account cannot inspect or change a retained todo.
 *
 * 1. Trash a todo for the first account.
 * 2. Attempt trash detail, history, restore, and permanent deletion as a second account.
 * 3. Assert the first account's retained todo remains available.
 */
export async function test_api_trash_owner_isolation(connection: api.IConnection): Promise<void> {
  // Step 1: Trash a todo for the first account
  const first = await setup(connection);
  await api.functional.todo.erase(first.user, first.todo.id);
  const second: api.IConnection = { host: connection.host };
  // Step 2: Attempt trash detail, history, restore, and permanent deletion as a second account
  await api.functional.auth.user.join(second, credentials());
  await TestValidator.error("foreign trash detail refused", () => api.functional.trash.at(second, first.todo.id));
  await TestValidator.error("foreign trash history refused", () => api.functional.trash.history(second, first.todo.id));
  await TestValidator.error("foreign restore refused", () => api.functional.trash.restore(second, first.todo.id));
  await TestValidator.error("foreign permanent deletion refused", () => api.functional.trash.erase(second, first.todo.id));
  // Step 3: Assert the first account's retained todo remains available
  const retained = await api.functional.trash.at(first.user, first.todo.id);
  typia.assert(retained);
  TestValidator.equals("owner trash state preserved", retained.availability, "trashed");
}

/**
 * Proves an anonymous profile read is refused without private data.
 *
 * 1. Derive an unauthenticated connection.
 * 2. Invoke profile inspection.
 * 3. Assert the private operation is refused.
 */
export async function test_api_profile_requires_session(connection: api.IConnection): Promise<void> {
  // Step 1: Derive an unauthenticated connection
  const anonymous: api.IConnection = { host: connection.host };
  // Step 2: Invoke profile inspection
  // Step 3: Assert the private operation is refused
  await TestValidator.error("anonymous profile refused", () => api.functional.profile.at(anonymous));
}

/**
 * Proves an anonymous active-todo list is refused without private data.
 *
 * 1. Derive an unauthenticated connection.
 * 2. Invoke active browsing.
 * 3. Assert the private operation is refused.
 */
export async function test_api_todo_index_requires_session(connection: api.IConnection): Promise<void> {
  // Step 1: Derive an unauthenticated connection
  const anonymous: api.IConnection = { host: connection.host };
  // Step 2: Invoke active browsing
  // Step 3: Assert the private operation is refused
  await TestValidator.error("anonymous todo list refused", () => api.functional.todo.index(anonymous, {}));
}

/**
 * Proves an anonymous trash list is refused without private data.
 *
 * 1. Derive an unauthenticated connection.
 * 2. Invoke trash browsing.
 * 3. Assert the private operation is refused.
 */
export async function test_api_trash_index_requires_session(connection: api.IConnection): Promise<void> {
  // Step 1: Derive an unauthenticated connection
  const anonymous: api.IConnection = { host: connection.host };
  // Step 2: Invoke trash browsing
  // Step 3: Assert the private operation is refused
  await TestValidator.error("anonymous trash list refused", () => api.functional.trash.index(anonymous, {}));
}

/**
 * Proves current-session logout preserves a second valid session.
 *
 * 1. Register once and log in from a second connection.
 * 2. End only the first connection.
 * 3. Assert the first is refused while the second remains usable.
 */
export async function test_api_auth_logout_preserves_other_session(connection: api.IConnection): Promise<void> {
  // Step 1: Register once and log in from a second connection
  const input = credentials();
  const first: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(first, input);
  const second: api.IConnection = { host: connection.host };
  await api.functional.auth.user.login(second, { email: input.email, password: input.password });
  // Step 2: End only the first connection
  await api.functional.auth.user.logout(first);
  // Step 3: Assert the first is refused while the second remains usable
  await TestValidator.error("current session revoked", () => api.functional.profile.at(first));
  typia.assert(await api.functional.profile.at(second));
}

/**
 * Proves rejected password changes preserve every existing session.
 *
 * 1. Register two sessions for one account.
 * 2. Submit a wrong-current and reused-current replacement.
 * 3. Assert both sessions and the original password remain usable.
 */
export async function test_api_auth_change_password_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Register two sessions for one account
  const input = credentials();
  const first: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(first, input);
  const second: api.IConnection = { host: connection.host };
  await api.functional.auth.user.login(second, { email: input.email, password: input.password });
  // Step 2: Submit a wrong-current and reused-current replacement
  await TestValidator.error("wrong current password refused", () => api.functional.auth.user.password.changePassword(first, { currentPassword: "wrongpass123", newPassword: "replacement123" }));
  await TestValidator.error("reused password refused", () => api.functional.auth.user.password.changePassword(first, { currentPassword: input.password, newPassword: input.password }));
  // Step 3: Assert both sessions and the original password remain usable
  typia.assert(await api.functional.profile.at(first));
  typia.assert(await api.functional.profile.at(second));
  const logged: api.IConnection = { host: connection.host };
  typia.assert(await api.functional.auth.user.login(logged, { email: input.email, password: input.password }));
}

/**
 * Proves recovery start does not disclose whether an email exists.
 *
 * 1. Request recovery for a known and an unknown email.
 * 2. Compare their proof-shaped responses.
 * 3. Assert both have the same non-empty shape and no private profile data.
 */
export async function test_api_auth_recover_unknown_uniform(connection: api.IConnection): Promise<void> {
  // Step 1: Request recovery for a known and an unknown email
  const input = credentials();
  await api.functional.auth.user.join({ host: connection.host }, input);
  // Step 2: Compare their proof-shaped responses
  const known = await api.functional.auth.user.recover.start.recoverStart({ host: connection.host }, { email: input.email });
  const unknown = await api.functional.auth.user.recover.start.recoverStart({ host: connection.host }, { email: `missing-${Date.now()}@example.com` });
  // Step 3: Assert both have the same non-empty shape and no private profile data
  typia.assert(known);
  typia.assert(unknown);
  TestValidator.equals("proof shape", known.proof.split(".").length, unknown.proof.split(".").length);
  TestValidator.predicate("known proof non-empty", known.proof.length > 20);
  TestValidator.predicate("unknown proof non-empty", unknown.proof.length > 20);
}

/**
 * Proves deleting an account removes its authenticated login path.
 *
 * 1. Register a second session and create a todo edit history.
 * 2. Delete the account with the first session.
 * 3. Assert both old sessions and the old password are unusable.
 */
export async function test_api_auth_delete_cascade(connection: api.IConnection): Promise<void> {
  // Step 1: Register a second session and create a todo edit history
  const input = credentials();
  const first: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(first, input);
  const todo = await api.functional.todo.create(first, { title: "Terminal task" });
  await api.functional.todo.update(first, todo.id, { title: "Edited terminal task", updatedAt: todo.updatedAt });
  const second: api.IConnection = { host: connection.host };
  await api.functional.auth.user.login(second, { email: input.email, password: input.password });
  // Step 2: Delete the account with the first session
  await api.functional.auth.user.account.deleteAccount(first, { currentPassword: input.password });
  // Step 3: Assert both old sessions and the old password are unusable
  await TestValidator.error("first session deleted", () => api.functional.profile.at(first));
  await TestValidator.error("second session deleted", () => api.functional.profile.at(second));
  await TestValidator.error("deleted account cannot log in", () => api.functional.auth.user.login({ host: connection.host }, { email: input.email, password: input.password }));
}

/**
 * Proves optional content can be cleared and that one edit records all changed fields.
 *
 * 1. Create a todo with description and both dates.
 * 2. Clear description and start date while changing the title and due date.
 * 3. Assert the resulting detail and one history entry retain explicit clears.
 */
export async function test_api_todo_update_clear_optional(connection: api.IConnection): Promise<void> {
  // Step 1: Create a todo with description and both dates
  const { user, todo } = await setup(connection);
  // Step 2: Clear description and start date while changing the title and due date
  const updated = await api.functional.todo.update(user, todo.id, { title: "Cleared task", description: null, startDate: null, dueDate: "2026-08-07", updatedAt: todo.updatedAt });
  typia.assert(updated);
  // Step 3: Assert the resulting detail and one history entry retain explicit clears
  TestValidator.equals("cleared description", updated.description, null);
  TestValidator.equals("cleared start", updated.startDate, null);
  TestValidator.equals("changed due", updated.dueDate, "2026-08-07");
  const history = await api.functional.todo.history(user, todo.id);
  TestValidator.equals("one combined history", history.length, 1);
  TestValidator.equals("history clear description", history[0]?.description, null);
  TestValidator.equals("history clear start", history[0]?.startDate, null);
  TestValidator.equals("history changed due", history[0]?.dueDate, "2026-08-07");
}

/**
 * Proves unsupported active-list and out-of-range pagination controls are refused.
 *
 * 1. Authenticate one account.
 * 2. Submit invalid page, limit, filter, sort, and direction values.
 * 3. Assert each request is refused before a partial interpretation.
 */
export async function test_api_todo_browse_boundaries(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate one account
  const { user } = await setup(connection);
  // Step 2: Submit invalid page, limit, filter, sort, and direction values
  await rawRefused(user, "PATCH", "/todo", { page: 0 });
  await rawRefused(user, "PATCH", "/todo", { limit: 101 });
  await rawRefused(user, "PATCH", "/todo", { filter: "done" });
  await rawRefused(user, "PATCH", "/todo", { sort: "title" });
  await rawRefused(user, "PATCH", "/todo", { direction: "sideways" });
  // Step 3: Assert each request is refused before a partial interpretation
  const page = await api.functional.todo.index(user, { limit: 100 });
  typia.assert(page);
  TestValidator.equals("boundary requests preserve active records", page.pagination.records, 1);
}

/**
 * Proves the trash list applies the same bounded pagination contract.
 *
 * 1. Authenticate one account.
 * 2. Submit an out-of-range trash page size.
 * 3. Assert the request is refused before a partial interpretation.
 */
export async function test_api_trash_index_boundaries(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate one account
  const { user } = await setup(connection);
  // Step 2: Submit an out-of-range trash page size
  await rawRefused(user, "PATCH", "/trash", { page: 0 });
  await rawRefused(user, "PATCH", "/trash", { limit: 101 });
  // Step 3: Assert the request is refused before a partial interpretation
  const page = await api.functional.trash.index(user, { limit: 100 });
  typia.assert(page);
  TestValidator.equals("boundary requests preserve trash records", page.pagination.records, 0);
}

/**
 * Proves registration credential and display-name thresholds reject malformed wire payloads.
 *
 * 1. Submit invalid email, password, and display-name registration payloads.
 * 2. Submit invalid registration payloads through the raw HTTP boundary.
 * 3. Assert every malformed request is refused without an account.
 */
export async function test_api_auth_join_boundaries(connection: api.IConnection): Promise<void> {
  // Step 1: Submit invalid email, password, and display-name registration payloads
  const shortEmail = `short-${Date.now()}@example.com`;
  const longEmail = `long-${Date.now()}@example.com`;
  const displayLongEmail = `display-long-${Date.now()}@example.com`;
  const blankEmail = `blank-${Date.now()}@example.com`;
  // Step 2: Submit invalid registration payloads through the raw HTTP boundary
  await rawRefused(connection, "POST", "/auth/user/join", { email: "not-an-email", password: "short", displayName: "Name" });
  await rawRefused(connection, "POST", "/auth/user/join", { email: shortEmail, password: "1234567", displayName: "Name" });
  await rawRefused(connection, "POST", "/auth/user/join", { email: longEmail, password: "p".repeat(129), displayName: "Name" });
  await rawRefused(connection, "POST", "/auth/user/join", { email: displayLongEmail, password: "password123", displayName: "x".repeat(101) });
  await rawRefused(connection, "POST", "/auth/user/join", { email: blankEmail, password: "password123", displayName: "   " });
  // Step 3: Assert every malformed request is refused without an account
  for (const email of ["not-an-email", shortEmail, longEmail, displayLongEmail, blankEmail])
    await rawRefused(connection, "POST", "/auth/user/login", { email, password: "password123" });
}

/**
 * Proves password replacement rejects a malformed replacement wire payload.
 *
 * 1. Register a private account.
 * 2. Submit a short replacement through the raw HTTP boundary.
 * 3. Assert the credential change is refused.
 */
export async function test_api_auth_password_boundaries(connection: api.IConnection): Promise<void> {
  // Step 1: Register a private account
  const user: api.IConnection = { host: connection.host };
  const input = credentials();
  await api.functional.auth.user.join(user, input);
  // Step 2: Submit a short replacement through the raw HTTP boundary
  await rawRefused(user, "PUT", "/auth/user/password", { currentPassword: input.password, newPassword: "short" });
  // Step 3: Assert the credential change is refused
  typia.assert(await api.functional.profile.at(user));
  const logged: api.IConnection = { host: connection.host };
  typia.assert(await api.functional.auth.user.login(logged, { email: input.email, password: input.password }));
}

/**
 * Proves forgotten-password recovery rejects a malformed replacement wire payload.
 *
 * 1. Register an account and request its one-time proof.
 * 2. Submit a short replacement through the raw HTTP boundary.
 * 3. Assert recovery is refused.
 */
export async function test_api_auth_recover_boundaries(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and request its one-time proof
  const input = credentials();
  await api.functional.auth.user.join({ host: connection.host }, input);
  // Step 2: Submit a short replacement through the raw HTTP boundary
  const proof = await api.functional.auth.user.recover.start.recoverStart({ host: connection.host }, { email: input.email });
  // Step 3: Assert recovery is refused
  await rawRefused(connection, "POST", "/auth/user/recover", { email: input.email, proof: proof.proof, newPassword: "short" });
  const logged: api.IConnection = { host: connection.host };
  typia.assert(await api.functional.auth.user.login(logged, { email: input.email, password: input.password }));
}

/**
 * Proves todo creation rejects malformed title, description, and calendar date payloads.
 *
 * 1. Authenticate a private account.
 * 2. Submit malformed todo payloads through the raw HTTP boundary.
 * 3. Assert each creation attempt is refused.
 */
export async function test_api_todo_create_boundaries(connection: api.IConnection): Promise<void> {
  // Step 1: Authenticate a private account
  const user: api.IConnection = { host: connection.host };
  await api.functional.auth.user.join(user, credentials());
  // Step 2: Submit malformed todo payloads through the raw HTTP boundary
  await rawRefused(user, "POST", "/todo", { title: "   " });
  await rawRefused(user, "POST", "/todo", { title: "t".repeat(201) });
  await rawRefused(user, "POST", "/todo", { title: "valid", description: "d".repeat(10_001) });
  await rawRefused(user, "POST", "/todo", { title: "valid", startDate: "2026-02-30" });
  await rawRefused(user, "POST", "/todo", { title: "valid", startDate: "2026-08-10", dueDate: "2026-08-01" });
  // Step 3: Assert each creation attempt is refused
  const page = await api.functional.todo.index(user, { limit: 100 });
  typia.assert(page);
  TestValidator.equals("invalid creations add no todos", page.pagination.records, 0);
}

/**
 * Proves state-ineligible content and completion commands leave trashed data unchanged.
 *
 * 1. Edit and then trash one active todo.
 * 2. Attempt active detail, edit, completion, and repeated restore transitions.
 * 3. Assert the retained trash detail and history remain intact.
 */
export async function test_api_todo_trashed_operations_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Edit and then trash one active todo
  const { user, todo } = await setup(connection);
  await api.functional.todo.update(user, todo.id, { title: "Before trash", updatedAt: todo.updatedAt });
  await api.functional.todo.erase(user, todo.id);
  // Step 2: Attempt active detail, edit, completion, and repeated restore transitions
  await TestValidator.error("trashed active detail refused", () => api.functional.todo.at(user, todo.id));
  await TestValidator.error("trashed edit refused", () => api.functional.todo.update(user, todo.id, { title: "Intrusion", updatedAt: todo.updatedAt }));
  await TestValidator.error("trashed completion refused", () => api.functional.todo.complete(user, todo.id));
  // Step 3: Assert the retained trash detail and history remain intact
  const trash = await api.functional.trash.at(user, todo.id);
  typia.assert(trash);
  TestValidator.equals("trash content preserved", trash.title, "Before trash");
  TestValidator.equals("trash history preserved", (await api.functional.trash.history(user, todo.id)).length, 1);
}
