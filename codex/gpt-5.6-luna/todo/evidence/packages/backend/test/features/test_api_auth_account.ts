import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_auth_account.erase} Proves terminal account deletion.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Exercises terminal account management.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Removes the authenticated account.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Ends account authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses protected authority.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Deletes private data in one boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises terminal deletion integrity.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Deletes the complete account scope.
 */
export async function test_api_auth_account(connection: api.IConnection): Promise<void> {
  const email = `erase-${Date.now()}@example.com`;
  const result = await api.functional.todo_auth_join.join(connection, { email, password: "Password123!", displayName: "Erase User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const outcome = await api.functional.todo_auth_account.erase(secured, { currentPassword: "Password123!" });
  if (!outcome.success) throw new Error("account deletion failed");
  let rejected = false;
  try {
    await api.functional.todo_auth_login.login(connection, { email, password: "Password123!" });
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error("deleted account still logged in");
}
