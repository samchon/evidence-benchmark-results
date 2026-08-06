import * as api from "@benchmark/erp-api";

/** Proves seeded and user-created chart accounts retain lifecycle state.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-account-ledger-account-lifecycle Exercises the ledger-account lifecycle, including merge and delete rules.
 */
export async function test_api_accounts(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `accounts-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Accounts ${suffix}`, code: `accounts-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const seeded = await api.functional.account_search.index(owner, { accountType: "asset" });
  if (!seeded.data.some((account) => account.code === "1000")) throw new Error("organization setup did not seed the asset account category");
  const account = await api.functional.account_create.create(owner, { code: "1010", name: "Cash", accountType: "asset" });
  const revised = await api.functional.account_update.update(owner, account.id, { name: "Operating Cash", description: "Primary cash account" });
  if (revised.name !== "Operating Cash") throw new Error("account revision was not retained");
  const found = await api.functional.account_search.index(owner, { search: "Operating" });
  if (!found.data.some((item) => item.id === account.id)) throw new Error("account search omitted the created account");
  await api.functional.account_status.status(owner, account.id, { active: false });
  const mergeSource = await api.functional.account_create.create(owner, { code: "1020", name: "Merge Source", accountType: "asset" });
  const mergeTarget = await api.functional.account_create.create(owner, { code: "1030", name: "Merge Target", accountType: "asset" });
  const mergeJournal = await api.functional.journal_create.create(owner, { sourceModule: "manual", memo: "Merge history", entryDate: "2026-01-20T00:00:00.000Z", currencyCode: "USD", lines: [{ accountId: mergeSource.id, debit: 25, credit: 0 }, { accountId: mergeTarget.id, debit: 0, credit: 25 }] });
  await api.functional.journal_post.post(owner, mergeJournal.id);
  const mergeRequest = await api.functional.account_merge_request_create.create(owner, { sourceAccountId: mergeSource.id, targetAccountId: mergeTarget.id, reason: "Consolidate duplicate posted account" });
  const approved = await api.functional.account_merge_request_status.status(owner, mergeRequest.id, { status: "approved" });
  const applied = await api.functional.account_merge_request_apply.apply(owner, mergeRequest.id);
  if (approved.status !== "approved" || applied.status !== "applied") throw new Error("approved account merge was not applied");
  await api.functional.account_delete.remove(owner, account.id);
}
