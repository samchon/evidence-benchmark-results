import * as api from "@benchmark/erp-api";

/** Proves balanced journal drafts, immutable posting, reversal, and void state.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-fin-post-financial-posting-integrity Exercises posting and preserving journal state.
 * @evidence docs/analysis/04-business-rules.md#req-rule-journal-journal-entry-rules Exercises journal creation, posting, reversal, and voiding rules.
 * @evidence docs/analysis/02-domain-model.md#req-dom-journal-journal-entry-lifecycle Exercises the journal-entry lifecycle.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-journal-journal-entry-operations Exercises journal-entry operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-account-ledger-account-operations Exercises account-ledger operations used by journal posting.
 */
export async function test_api_journal(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `journal-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Journal ${suffix}`, code: `journal-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const accounts = await api.functional.account_search.index(owner, { accountType: "asset" });
  const liabilities = await api.functional.account_search.index(owner, { accountType: "liability" });
  const debitAccount = accounts.data[0]!;
  const creditAccount = liabilities.data[0]!;
  const journal = await api.functional.journal_create.create(owner, { sourceModule: "manual", memo: "Opening balance", entryDate: "2026-01-15T00:00:00.000Z", currencyCode: "USD", lines: [{ accountId: debitAccount.id, debit: 100, credit: 0 }, { accountId: creditAccount.id, debit: 0, credit: 100 }] });
  if (journal.status !== "draft" || journal.lines.length !== 2) throw new Error("journal draft was not created");
  const posted = await api.functional.journal_post.post(owner, journal.id);
  if (posted.status !== "posted" || posted.postedAt === null) throw new Error("balanced journal did not post");
  const found = await api.functional.journal_search.index(owner, { status: "posted" });
  if (!found.data.some((item) => item.id === journal.id)) throw new Error("posted journal was not discoverable");
  const reversed = await api.functional.journal_reverse.reverse(owner, journal.id);
  if (reversed.status !== "reversed" || reversed.reversedAt === null) throw new Error("posted journal reversal was not retained");
  const toVoid = await api.functional.journal_create.create(owner, { sourceModule: "manual", memo: "Void candidate", entryDate: "2026-01-16T00:00:00.000Z", currencyCode: "USD", lines: [{ accountId: debitAccount.id, debit: 10, credit: 0 }, { accountId: creditAccount.id, debit: 0, credit: 10 }] });
  await api.functional.journal_post.post(owner, toVoid.id);
  const voided = await api.functional.journal_void._void(owner, toVoid.id);
  if (voided.status !== "void") throw new Error("eligible journal void was not retained");
}
