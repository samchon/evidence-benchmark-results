import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.auth.user.recovery.request.execute.recoveryRequest} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 */
export async function test_api_auth_user_recovery_request(connection: api.IConnection): Promise<void> {
  await api.functional.auth.user.recovery.request.execute.recoveryRequest({ ...connection, simulate: true }, { email: "user@example.com" });
}








