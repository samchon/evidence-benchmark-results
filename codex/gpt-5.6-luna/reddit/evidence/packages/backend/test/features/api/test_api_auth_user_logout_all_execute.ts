import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.auth.user.logout_all.execute.logoutAll} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 */
export async function test_api_auth_user_logout_all_execute(connection: api.IConnection): Promise<void> {
  await api.functional.auth.user.logout_all.execute.logoutAll({ ...connection, simulate: true });
}








