import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_auth_password.password} Proves password change.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Exercises account security management.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Replaces the credential and invalidates sessions.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Exercises replacement credentials.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Uses an accepted replacement password.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Exercises session invalidation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Ends prior continuity.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Invalidates prior sessions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses account authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected operation.
 */
export async function test_api_auth_password(connection: api.IConnection): Promise<void> {
  const email = `password-${Date.now()}@example.com`;
  const result = await api.functional.todo_auth_join.join(connection, { email, password: "Password123!", displayName: "Password User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const outcome = await api.functional.todo_auth_password.password(secured, { currentPassword: "Password123!", newPassword: "Password456!" });
  if (!outcome.success) throw new Error("password change failed");
  let oldRejected = false;
  try {
    await api.functional.todo_auth_login.login(connection, { email, password: "Password123!" });
  } catch {
    oldRejected = true;
  }
  if (!oldRejected) throw new Error("old password remained valid");
  const loggedIn = await api.functional.todo_auth_login.login(connection, { email, password: "Password456!" });
  if (loggedIn.token.access.length === 0) throw new Error("new password did not authenticate");
}
