import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_auth_logout_all.logoutAll} Proves all-session logout.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Exercises account session management.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Revokes every account session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Ends account authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected operation.
 */
export async function test_api_auth_logout_all(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `logout-all-${Date.now()}@example.com`, password: "Password123!", displayName: "Logout All" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const outcome = await api.functional.todo_auth_logout_all.logoutAll(secured);
  if (!outcome.success) throw new Error("logout-all failed");
}
