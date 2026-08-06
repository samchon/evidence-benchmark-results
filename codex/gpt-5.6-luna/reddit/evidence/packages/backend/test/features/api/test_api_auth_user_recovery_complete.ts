import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.auth.user.recovery.complete.execute.recoveryComplete} Exercises the generated operation accessor.
 */
export async function test_api_auth_user_recovery_complete(connection: api.IConnection): Promise<void> {
  await api.functional.auth.user.recovery.complete.execute.recoveryComplete({ ...connection, simulate: true }, { email: "user@example.com", proof: "proof-token", newPassword: "Password123!" });
}






