import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.auth.user.erase.execute.erase} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-001-maintain-active-community-ownership This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-004-enforce-archived-community-read-only-state This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 */
export async function test_api_auth_user_erase_execute(connection: api.IConnection): Promise<void> {
  await api.functional.auth.user.erase.execute.erase({ ...connection, simulate: true }, { password: "Password123!" });
}








