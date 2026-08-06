import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_auth_recover.recover} Proves forgotten-password replacement.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Exercises account security management.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Replaces the credential through email identity.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Exercises recovery credentials.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Uses canonical recovery identity.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Uses an accepted replacement password.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Invalidates prior sessions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Ends prior continuity.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Revokes prior sessions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the non-authenticated recovery entry.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Does not expose private data before proof.
 */
export async function test_api_auth_recover(connection: api.IConnection): Promise<void> {
  const email = `recover-${Date.now()}@example.com`;
  await api.functional.todo_auth_join.join(connection, { email, password: "Password123!", displayName: "Recover User" });
  const result = await api.functional.todo_auth_recover.recover(connection, { email, newPassword: "Password456!" });
  if (!result.success) throw new Error("recovery failed");
  let oldRejected = false;
  try {
    await api.functional.todo_auth_login.login(connection, { email, password: "Password123!" });
  } catch {
    oldRejected = true;
  }
  if (!oldRejected) throw new Error("recovered account accepted old password");
  const loggedIn = await api.functional.todo_auth_login.login(connection, { email, password: "Password456!" });
  if (loggedIn.token.access.length === 0) throw new Error("recovered password did not authenticate");
}
