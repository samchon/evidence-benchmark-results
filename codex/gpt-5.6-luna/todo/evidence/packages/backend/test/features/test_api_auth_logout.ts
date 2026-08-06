import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_auth_logout.logout} Proves current-session logout.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Exercises session logout.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Revokes the current session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Ends current authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected operation.
 */
export async function test_api_auth_logout(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `logout-${Date.now()}@example.com`, password: "Password123!", displayName: "Logout User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const outcome = await api.functional.todo_auth_logout.logout(secured);
  if (!outcome.success) throw new Error("logout failed");
}
