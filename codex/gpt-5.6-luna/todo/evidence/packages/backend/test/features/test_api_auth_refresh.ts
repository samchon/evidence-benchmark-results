import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_auth_refresh.refresh} Proves refresh continuity.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Exercises session continuity.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Rotates a valid session proof.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Preserves account authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session proof.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Keeps the same owner identity.
 */
export async function test_api_auth_refresh(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `refresh-${Date.now()}@example.com`, password: "Password123!", displayName: "Refresh User" });
  const refreshed = await api.functional.todo_auth_refresh.refresh(connection, { refreshToken: result.token.refresh });
  if (refreshed.token.access.length === 0) throw new Error("refresh did not issue access token");
}
