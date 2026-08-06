import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves bank transaction matching, reconciliation, tax-return filing, and vendor credits. */
export async function test_api_finance_operations(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-finops`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `FinOps ${suffix}`, code: `finops-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("finance-operations membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const bank = await api.functional.organization.bank_account.createBank(owner, { code: `BANK-${suffix}`, name: "Operating", currency_code: "USD" }); typia.assert(bank);
  const transaction = await api.functional.organization.bank_transaction.createTransaction(owner, { bank_account_id: bank.id, amount: 100, reference: "DEP-1" });
  const matched = await api.functional.organization.bank_transaction.match.matchTransaction(owner, transaction.id); if (matched.status !== "matched") throw new Error("bank transaction did not match");
  const reconciliation = await api.functional.organization.reconciliation.createReconciliation(owner, { bank_account_id: bank.id, period_start: "2026-01-01T00:00:00.000Z", period_end: "2026-01-31T00:00:00.000Z" });
  const complete = await api.functional.organization.reconciliation.complete.completeReconciliation(owner, reconciliation.id); if (complete.status !== "completed") throw new Error("reconciliation did not complete");
  const jurisdiction = await api.functional.organization.tax_jurisdiction.createJurisdiction(owner, { name: `VAT ${suffix}`, territoryCode: "US" });
  const taxReturn = await api.functional.organization.tax_return.createTaxReturn(owner, { jurisdiction_id: jurisdiction.id, period_key: "2026-Q1", amount: 20 });
  await api.functional.organization.tax_return.approve.approveTaxReturn(owner, taxReturn.id);
  const filed = await api.functional.organization.tax_return.file.fileTaxReturn(owner, taxReturn.id); if (filed.status !== "filed") throw new Error("tax return did not file");
  const vendor = await api.functional.organization.vendor.createVendor(owner, { name: `Vendor ${suffix}` });
  const credit = await api.functional.organization.vendor_credit.createCredit(owner, { vendor_id: vendor.id, amount: 50 });
  const applied = await api.functional.organization.vendor_credit.apply.applyCredit(owner, credit.id); if (applied.status !== "applied") throw new Error("vendor credit did not apply");
}
