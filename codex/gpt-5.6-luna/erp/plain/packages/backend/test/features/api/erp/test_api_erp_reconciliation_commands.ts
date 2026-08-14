import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves reconciliation reopening is approval-controlled and reasoned. */
export async function test_api_erp_reconciliation_commands(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const account = await api.functional.erp.account.create(owner.connection, { code: `RC${Date.now()}`.slice(-8), name: "Reconciliation Cash", type: "asset", parentId: null, currency: "USD" });
  const bank = await api.functional.erp.control_ops.bank_account.bankCreate(owner.connection, { ledgerAccountId: account.id, name: "Reconciliation", maskedNumber: "****6666" });
  const imported = await api.functional.erp.bank.transaction._import.transactionImport(owner.connection, { bankAccountId: bank.id, transactions: [{ bankAccountId: bank.id, statementDate: "2026-08-10T00:00:00.000Z", amount: 10, currency: "USD", reference: "RC-1" }] });
  const transaction = imported[0];
  if (transaction === undefined) throw new Error("Reconciliation transaction was not imported.");
  const matched = await api.functional.erp.bank.transaction.transactionResolve(owner.connection, transaction.id, "ignored");
  const reconciliation = await api.functional.erp.bank.reconciliation.reconciliationCreate(owner.connection, { bankAccountId: bank.id, startsAt: "2026-08-01T00:00:00.000Z", endsAt: "2026-08-31T23:59:59.999Z", beginningBalance: 0, endingBalance: 10 });
  const lined = await api.functional.erp.bank.reconciliation.line.reconciliationLine(owner.connection, reconciliation.id, { bankTransactionId: matched.id, resolved: true });
  const completed = await api.functional.erp.bank.reconciliation.complete.reconciliationComplete(owner.connection, lined.id);
  const request = await api.functional.erp.bank.reconciliation.reopen_request.reconciliationReopenRequest(owner.connection, completed.id, { reason: "Correct a statement line." });
  await api.functional.erp.control_ops.approval.approvalResolve(owner.connection, request.id, "approved", { reason: "Approved correction." });
  const reopened = await api.functional.erp.bank.reconciliation.line.reconciliationLine(owner.connection, completed.id, { bankTransactionId: matched.id, resolved: true });
  if (reopened.status !== "in_progress") throw new Error("Approved reconciliation reopen did not permit line correction.");
}
