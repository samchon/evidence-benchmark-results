import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.auth.user.password.execute.changePassword} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 */
export async function test_api_auth_user_password_execute_change(connection: api.IConnection): Promise<void> {
  await api.functional.auth.user.password.execute.changePassword({ ...connection, simulate: true }, { currentPassword: "Password123!", newPassword: "Password1234!" });
}








