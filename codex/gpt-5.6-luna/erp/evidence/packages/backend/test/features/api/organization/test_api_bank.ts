import * as api from "@benchmark/erp-api";

/** Proves bank-account and statement-transaction lifecycle state.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-bank-bank-reconciliation-rules Exercises and asserts the bank bank reconciliation rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-bank-account-bank-accounts Exercises and asserts the bank account bank accounts behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-bank-transaction-bank-transaction-lifecycle Exercises and asserts the bank transaction bank transaction lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-reconciliation-bank-reconciliation-lifecycle Exercises and asserts the reconciliation bank reconciliation lifecycle behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-reconciliation-bank-reconciliation-operations Exercises and asserts the reconciliation bank reconciliation operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bank-account-bank-account-operations Exercises and asserts the bank account bank account operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bank-transaction-bank-transaction-operations Exercises and asserts the bank transaction bank transaction operations behavior.
 */
export async function test_api_bank(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `bank-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Bank ${suffix}`, code: `bank-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const accounts = await api.functional.account_search.index(owner, { accountType: "asset" });
  const bank = await api.functional.bank_account_create.create(owner, { institutionName: "Example Bank", accountReference: "CHK-001", currencyCode: "USD", openingBalance: 1000, ledgerAccountId: accounts.data[0]!.id });
  const revised = await api.functional.bank_account_update.update(owner, bank.id, { institutionName: "Example National Bank" });
  if (revised.institutionName !== "Example National Bank") throw new Error("bank account revision was not retained");
  const transaction = await api.functional.bank_transaction_create.create(owner, { bankAccountId: bank.id, statementDate: "2026-01-20T00:00:00.000Z", amount: -25, currencyCode: "USD", description: "Service fee", reference: "FEE-1" });
  if (transaction.status !== "imported") throw new Error("bank transaction did not begin imported");
  const matched = await api.functional.bank_transaction_match.match(owner, transaction.id, { matchType: "journal", matchId: authorized.memberships[0]!.organizationId });
  if (matched.status !== "matched") throw new Error("bank transaction match was not retained");
  const ignored = await api.functional.bank_transaction_create.create(owner, { bankAccountId: bank.id, statementDate: "2026-01-21T00:00:00.000Z", amount: -1, currencyCode: "USD", description: "Unknown" });
  await api.functional.bank_transaction_ignore.ignore(owner, ignored.id);
  const found = await api.functional.bank_transaction_search.index(owner, { bankAccountId: bank.id });
  if (found.data.length !== 2) throw new Error("bank transaction search omitted statement evidence");
  const reconciliation = await api.functional.reconciliation_create.create(owner, { bankAccountId: bank.id, periodStart: "2026-01-01T00:00:00.000Z", periodEnd: "2026-01-31T00:00:00.000Z", beginningBalance: 1000, endingBalance: 975 });
  await api.functional.reconciliation_line.line(owner, reconciliation.id, { bankTransactionId: transaction.id, included: true });
  const completed = await api.functional.reconciliation_complete.complete(owner, reconciliation.id);
  if (completed.status !== "completed" || !completed.lineIds.includes(transaction.id)) throw new Error("balanced reconciliation did not complete");
  const workflow = await api.functional.approval_workflow_create.create(owner, { name: `Reconciliation reopen ${suffix}`, targetType: "reconciliation_reopen", steps: "finance-manager" });
  await api.functional.approval_workflow_status.status(owner, workflow.id, { status: "active" });
  const approval = await api.functional.approval_request_create.create(owner, { workflowId: workflow.id, targetType: "reconciliation_reopen", targetId: reconciliation.id });
  await api.functional.approval_request_status.status(owner, approval.id, { status: "approved" });
  const reopened = await api.functional.reconciliation_reopen.reopen(owner, reconciliation.id);
  if (reopened.status !== "reopened") throw new Error("reconciliation reopen was not retained");
  await api.functional.bank_account_status.status(owner, bank.id, { active: false });
}
