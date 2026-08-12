import * as api from "@benchmark/todo-api";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import { joinUser, recoveryProof } from "../../../helpers/TodoSetup";

/**
 * Proves registration creates a private profile, session, and empty collection.
 *
 * 1. Register a new account through the public join operation.
 * 2. Read the profile and active Todo list with the issued session.
 * 3. Assert the session, profile, and empty collection are usable.
 */
export async function test_api_todo_auth_join(connection: api.IConnection): Promise<void> {
  // Step 1: Register a new account through the public join operation
  const user = await joinUser(connection);
  // Step 2: Read the profile and active Todo list with the issued session
  typia.assert(user.authorized);
  TestValidator.predicate("join issues an access token", user.authorized.token.access.length > 0);
  TestValidator.equals("join returns the private profile", user.authorized.user.displayName, "Private Owner");
  const profile = await api.functional.todo.user.profile.at(user.connection);
  TestValidator.equals("joined profile is persisted", profile.displayName, "Private Owner");
  const todos = await api.functional.todo.user.todo.index(user.connection, {});
  // Step 3: Assert the session, profile, and empty collection are usable
  TestValidator.equals("joined account starts with an empty Todo collection", todos.pagination.records, 0);
}

/**
 * Proves login creates an independent session for an existing account.
 *
 * 1. Register an account.
 * 2. Log in through a separate connection.
 * 3. Assert the returned session token differs from the registration session.
 */
export async function test_api_todo_auth_login(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account
  const first = await joinUser(connection);
  // Step 2: Log in through a separate connection
  const second: api.IConnection = { host: connection.host };
  const logged = await api.functional.todo.auth.user.login(second, { email: first.email, password: first.password });
  // Step 3: Assert the returned session token differs from the registration session
  typia.assert(logged);
  TestValidator.notEquals("login issues a distinct session token", first.authorized.refreshToken, logged.refreshToken);
}

/**
 * Proves unknown-email and wrong-password login failures have one outcome.
 *
 * 1. Register an account and attempt login with an unknown email.
 * 2. Attempt login with the real email, a wrong password, and malformed input.
 * 3. Assert every failure matches and the valid credential remains usable.
 */
export async function test_api_todo_auth_login_generic_failure(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and attempt login with an unknown email
  const user = await joinUser(connection);
  const unknown = await failureMessage(() => api.functional.todo.auth.user.login({ host: connection.host }, { email: "unknown@example.com", password: user.password }));
  // Step 2: Attempt login with the real email and a wrong password
  const wrong = await failureMessage(() => api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: "incorrect password" }));
  const malformed = await failureMessage(() => api.functional.todo.auth.user.login({ host: connection.host }, { email: "not-an-email", password: user.password }));
  // Step 3: Assert every failure matches and the valid credential remains usable
  TestValidator.equals("login hides which credential failed", unknown, wrong);
  TestValidator.equals("login hides malformed credential failure", malformed, wrong);
  const stillValid = await api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: user.password });
  typia.assert(stillValid);
}

/**
 * Proves refresh continues a still-valid session.
 *
 * 1. Register an account and submit its refresh token.
 * 2. Build a connection from the returned access token.
 * 3. Assert the refreshed token reaches the same private profile.
 */
export async function test_api_todo_auth_refresh(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and submit its refresh token
  const user = await joinUser(connection);
  const refreshed = await api.functional.todo.auth.user.refresh({ host: connection.host }, { refreshToken: user.authorized.refreshToken });
  // Step 2: Build a connection from the returned access token
  typia.assert(refreshed);
  TestValidator.equals("refresh returns the same private profile", user.authorized.user.displayName, refreshed.user.displayName);
  const continued: api.IConnection = { host: connection.host, headers: { Authorization: refreshed.token.access } };
  // Step 3: Assert the refreshed token reaches the same private profile
  const profile = await api.functional.todo.user.profile.at(continued);
  TestValidator.equals("refreshed access token continues the same account", profile.id, user.authorized.user.id);
}

/**
 * Proves a revoked session cannot be continued by its refresh token.
 *
 * 1. Register an account and revoke its current session by logging out.
 * 2. Submit the old refresh token.
 * 3. Assert refresh refuses the revoked session.
 */
export async function test_api_todo_auth_refresh_rejects_revoked_session(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and revoke its current session by logging out
  const user = await joinUser(connection);
  await api.functional.todo.user.logout(user.connection);
  // Step 2: Submit the old refresh token
  // Step 3: Assert refresh refuses the revoked session
  await TestValidator.error("revoked refresh token is refused", () => api.functional.todo.auth.user.refresh({ host: connection.host }, { refreshToken: user.authorized.refreshToken }));
}

/**
 * Proves forgotten-password entry is non-disclosing and succeeds uniformly.
 *
 * 1. Request recovery for an existing account and inspect the recorded delivery proof.
 * 2. Request recovery for an unknown email.
 * 3. Assert both requests acknowledge without exposing account existence.
 */
export async function test_api_todo_auth_recovery_request(connection: api.IConnection): Promise<void> {
  // Step 1: Request recovery for an existing account and inspect the recorded delivery proof
  const user = await joinUser(connection);
  const result = await api.functional.todo.auth.user.recovery.request.recoveryRequest({ host: connection.host }, { email: user.email });
  typia.assert(result);
  TestValidator.equals("recovery request acknowledges", result.success, true);
  const proof = await recoveryProof(user.email);
  // Step 2: Request recovery for an unknown email
  TestValidator.predicate("recovery request records a deliverable proof", proof.length > 0);
  const absent = await api.functional.todo.auth.user.recovery.request.recoveryRequest({ host: connection.host }, { email: "absent@example.com" });
  // Step 3: Assert both requests acknowledge without exposing account existence
  typia.assert(absent);
  TestValidator.equals("unknown recovery is acknowledged", absent.success, true);
}

/**
 * Proves an unproven recovery secret cannot replace a credential.
 *
 * 1. Register an account and request a recovery proof.
 * 2. Confirm recovery with a proof that was not delivered.
 * 3. Assert the credential-replacement attempt is refused.
 */
export async function test_api_todo_auth_recovery_confirm_rejects_invalid_proof(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account and request a recovery proof
  const user = await joinUser(connection);
  await api.functional.todo.auth.user.recovery.request.recoveryRequest({ host: connection.host }, { email: user.email });
  // Step 2: Confirm recovery with a proof that was not delivered
  // Step 3: Assert the credential-replacement attempt is refused
  await TestValidator.error("invalid recovery proof is refused", () => api.functional.todo.auth.user.recovery.confirm.recoveryConfirm({ host: connection.host }, { email: user.email, proof: "not-the-delivered-proof", newPassword: "new correct password" }));
}

/**
 * Proves successful recovery consumes its proof and replaces all old authority.
 *
 * 1. Register an account, create a second session, and request recovery.
 * 2. Confirm recovery with the delivered proof and a new password.
 * 3. Assert old sessions/passwords are refused and the proof is one-time.
 */
export async function test_api_todo_auth_recovery_confirm(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account, create a second session, and request recovery
  const user = await joinUser(connection);
  const other: api.IConnection = { host: connection.host };
  await api.functional.todo.auth.user.login(other, { email: user.email, password: user.password });
  await api.functional.todo.auth.user.recovery.request.recoveryRequest({ host: connection.host }, { email: user.email });
  const proof = await recoveryProof(user.email);
  // Step 2: Confirm recovery with the delivered proof and a new password
  const recovered = await api.functional.todo.auth.user.recovery.confirm.recoveryConfirm({ host: connection.host }, { email: user.email, proof, newPassword: "recovered password" });
  // Step 3: Assert old sessions/passwords are refused and the proof is one-time
  typia.assert(recovered);
  await TestValidator.error("recovery invalidates the prior access session", () => api.functional.todo.user.profile.at(user.connection));
  await TestValidator.error("recovery invalidates every prior session", () => api.functional.todo.user.profile.at(other));
  const logged = await api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: "recovered password" });
  typia.assert(logged);
  await TestValidator.error("recovery rejects the old password", () => api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: user.password }));
  await TestValidator.error("recovery proof is one-time", () => api.functional.todo.auth.user.recovery.confirm.recoveryConfirm({ host: connection.host }, { email: user.email, proof, newPassword: "another password" }));
}

/**
 * Proves invalid replacement input does not change the existing credential.
 *
 * 1. Register an account, request recovery, and read its delivered proof.
 * 2. Confirm recovery with a short replacement password.
 * 3. Assert the original password still authenticates.
 */
export async function test_api_todo_auth_recovery_rejects_short_password(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account, request recovery, and read its delivered proof
  const user = await joinUser(connection);
  await api.functional.todo.auth.user.recovery.request.recoveryRequest({ host: connection.host }, { email: user.email });
  const proof = await recoveryProof(user.email);
  // Step 2: Confirm recovery with a short replacement password
  await TestValidator.error("short recovery password is refused", () => api.functional.todo.auth.user.recovery.confirm.recoveryConfirm({ host: connection.host }, { email: user.email, proof, newPassword: "short" }));
  // Step 3: Assert the original password still authenticates
  const logged = await api.functional.todo.auth.user.login({ host: connection.host }, { email: user.email, password: user.password });
  typia.assert(logged);
}

async function failureMessage(action: () => Promise<unknown>): Promise<string> {
  try {
    await action();
  } catch (error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
  }
  throw new Error("The expected failure did not occur.");
}
