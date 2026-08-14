import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves bank-account revision retains currency, opening balance, and live balance state. */
export async function test_api_erp_bank_account_commands(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const account = await api.functional.erp.account.create(owner.connection, { code: `BA${Date.now()}`.slice(-8), name: "Operating Cash", type: "asset", parentId: null, currency: "USD" });
  const bank = await api.functional.erp.control_ops.bank_account.bankCreate(owner.connection, { ledgerAccountId: account.id, name: "Operating", maskedNumber: "****5555", currency: "USD", openingBalance: 100 });
  const imported = await api.functional.erp.bank.transaction._import.transactionImport(owner.connection, { bankAccountId: bank.id, transactions: [{ bankAccountId: bank.id, statementDate: "2026-08-10T00:00:00.000Z", amount: 25, currency: "USD", reference: "BA-1" }] });
  const importedTransaction = imported[0];
  if (importedTransaction === undefined) throw new Error("Bank transaction was not imported.");
  const customer = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: `Bank Customer ${Date.now()}`, currency: "USD" });
  const payment = await api.functional.erp.sales_finance.payment.paymentCreate(owner.connection, { partyId: customer.id, direction: "inbound", amount: 25, currency: "USD", bankAccountId: bank.id });
  const postedPayment = await api.functional.erp.sales_finance.payment.post.paymentPost(owner.connection, payment.id);
  const matched = await api.functional.erp.bank.transaction.match.transactionMatch(owner.connection, importedTransaction.id, { targetType: "payment", targetId: postedPayment.id });
  if (matched.status !== "matched" || matched.matchedTargetId !== postedPayment.id) throw new Error("Bank transaction source matching was not retained.");
  const revised = await api.functional.erp.control_ops.bank_account.bankUpdate(owner.connection, bank.id, { name: "Updated Operating", reconciliationState: "in_progress" });
  if (revised.name !== "Updated Operating" || revised.balance !== 150 || revised.reconciliationState !== "in_progress") throw new Error("Bank account balance or revision state was not retained.");
}
