import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.auth.user.refresh.execute.refresh} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 */
export async function test_api_auth_user_refresh_execute(connection: api.IConnection): Promise<void> {
  await api.functional.auth.user.refresh.execute.refresh({ ...connection, simulate: true }, { refreshToken: "refresh-token" });
}








