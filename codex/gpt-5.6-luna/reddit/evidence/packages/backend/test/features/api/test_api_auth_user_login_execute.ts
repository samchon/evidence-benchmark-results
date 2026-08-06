import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.auth.user.login.execute.login} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 */
export async function test_api_auth_user_login_execute(connection: api.IConnection): Promise<void> {
  await api.functional.auth.user.login.execute.login({ ...connection, simulate: true }, { email: "user@example.com", password: "Password123!" });
}








