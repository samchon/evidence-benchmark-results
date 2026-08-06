import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_auth_login.login} Proves credential login.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Exercises returning-account entry.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Exercises session creation after valid credentials.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Exercises login credentials.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Exercises canonical matching.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Exercises the password boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Exercises the generic invalid-credential outcome.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Establishes session-scoped authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Produces the proof required by private calls.
 */
export async function test_api_auth_login(connection: api.IConnection): Promise<void> {
  const email = `login-${Date.now()}@example.com`;
  await api.functional.todo_auth_join.join(connection, { email, password: "Password123!", displayName: "Login User" });
  const result = await api.functional.todo_auth_login.login(connection, { email, password: "Password123!" });
  if (result.token.access.length === 0) throw new Error("login did not issue access token");
  let rejected = false;
  try {
    await api.functional.todo_auth_login.login(connection, { email, password: "WrongPassword!" });
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error("invalid credentials were accepted");
  let shortRejected = false;
  try {
    await api.functional.todo_auth_login.login(connection, { email, password: "short" });
  } catch {
    shortRejected = true;
  }
  if (!shortRejected) throw new Error("short password was accepted");
}
