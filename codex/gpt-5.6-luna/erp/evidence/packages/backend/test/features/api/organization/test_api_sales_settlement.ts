import * as api from "@benchmark/erp-api";

/** Proves receivable invoice, customer payment, return, and credit memo states.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-credit-memo-credit-memo-rules Exercises and asserts the credit memo credit memo rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-sales-invoice-sales-invoice-rules Exercises and asserts the sales invoice sales invoice rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-sales-return-sales-return-rules Exercises and asserts the sales return sales return rules behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-sales-invoice-operations Exercises and asserts the sales invoice sales invoice operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-customer-payment-customer-payment-operations Exercises and asserts the customer payment customer payment operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-return-sales-return-operations Exercises and asserts the sales return sales return operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-credit-memo-credit-memo-operations Exercises and asserts the credit memo credit memo operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-sales-invoice-sales-invoice-lifecycle Exercises and asserts the sales invoice sales invoice lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-customer-payment-customer-payments Exercises and asserts the customer payment customer payments behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-sales-return-sales-return-lifecycle Exercises and asserts the sales return sales return lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-credit-memo-credit-memos Exercises and asserts the credit memo credit memos behavior.
 */
export async function test_api_sales_settlement(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `sales-settlement-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Sales Settlement ${suffix}`, code: `sales-settlement-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const customer = await api.functional.customer_create.create(owner, { code: "C-001", legalName: "Buyer" });
  const invoice = await api.functional.sales_invoice_create.create(owner, { customerId: customer.id, invoiceDate: "2026-08-05T00:00:00.000Z", totalAmount: 300 });
  await api.functional.sales_invoice_status.status(owner, invoice.id, { status: "approved" });
  const postedInvoice = await api.functional.sales_invoice_status.status(owner, invoice.id, { status: "posted" });
  const payment = await api.functional.customer_payment_create.create(owner, { customerId: customer.id, paymentDate: "2026-08-06T00:00:00.000Z", amount: 300 });
  await api.functional.customer_payment_status.status(owner, payment.id, { status: "approved" });
  const postedPayment = await api.functional.customer_payment_status.status(owner, payment.id, { status: "posted" });
  const reversedPayment = await api.functional.customer_payment_status.status(owner, payment.id, { status: "reversed" });
  const salesReturn = await api.functional.sales_return_create.create(owner, { returnDate: "2026-08-07T00:00:00.000Z", reason: "Damaged" });
  await api.functional.sales_return_status.status(owner, salesReturn.id, { status: "approved" });
  const postedReturn = await api.functional.sales_return_status.status(owner, salesReturn.id, { status: "posted" });
  let invalidReturnRefundRefused = false;
  try { await api.functional.sales_return_status.status(owner, salesReturn.id, { status: "refunded" }); } catch { invalidReturnRefundRefused = true; }
  if (!invalidReturnRefundRefused) throw new Error("sales-return refund without exactly one source was accepted");
  const credit = await api.functional.credit_memo_create.create(owner, { customerId: customer.id, salesInvoiceId: invoice.id, amount: 50 });
  await api.functional.credit_memo_status.status(owner, credit.id, { status: "approved" });
  const settledCredit = await api.functional.credit_memo_status.status(owner, credit.id, { status: "settled" });
  const accountRows = await api.functional.account_search.index(owner, { accountType: "asset" });
  const refundBank = await api.functional.bank_account_create.create(owner, { institutionName: "Refund Bank", accountReference: `REF-${suffix}`, currencyCode: "USD", openingBalance: 0, ledgerAccountId: accountRows.data[0]!.id });
  const refundableCredit = await api.functional.credit_memo_create.create(owner, { customerId: customer.id, salesInvoiceId: invoice.id, amount: 40 });
  await api.functional.credit_memo_status.status(owner, refundableCredit.id, { status: "approved" });
  const refundedCredit = await api.functional.credit_memo_status.status(owner, refundableCredit.id, { status: "refunded", refundBankAccountId: refundBank.id });
  const returnRefund = await api.functional.sales_return_status.status(owner, salesReturn.id, { status: "refunded", refundCreditMemoId: refundableCredit.id });
  if (postedInvoice.status !== "posted" || postedPayment.status !== "posted" || reversedPayment.status !== "reversed" || postedReturn.status !== "posted" || returnRefund.status !== "refunded" || returnRefund.refundCreditMemoId !== refundableCredit.id || returnRefund.refundedAt === null || settledCredit.status !== "settled" || refundedCredit.status !== "refunded" || refundedCredit.refundBankAccountId !== refundBank.id || refundedCredit.refundedAt === null) throw new Error("sales settlement state was not retained");
}
