import * as api from "@benchmark/erp-api";

/** Proves receipt posting and vendor bill/payment/credit settlement states.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
export async function test_api_procurement_settlement(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `settlement-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Settlement ${suffix}`, code: `settlement-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const vendor = await api.functional.vendor_create.create(owner, { code: "V-001", legalName: "Supplier" });
  const order = await api.functional.purchase_order_create.create(owner, { vendorId: vendor.id, currencyCode: "USD", totalAmount: 100 });
  const receipt = await api.functional.purchase_receipt_create.create(owner, { purchaseOrderId: order.id, receiptDate: "2026-08-05T00:00:00.000Z" });
  const postedReceipt = await api.functional.purchase_receipt_status.status(owner, receipt.id, { status: "posted" });
  const bill = await api.functional.vendor_bill_create.create(owner, { vendorId: vendor.id, purchaseOrderId: order.id, billDate: "2026-08-05T00:00:00.000Z", totalAmount: 100 });
  await api.functional.vendor_bill_status.status(owner, bill.id, { status: "approved" });
  const postedBill = await api.functional.vendor_bill_status.status(owner, bill.id, { status: "posted" });
  let missingDisputeReasonRefused = false;
  try { await api.functional.vendor_bill_status.status(owner, bill.id, { status: "disputed" }); } catch { missingDisputeReasonRefused = true; }
  if (!missingDisputeReasonRefused) throw new Error("vendor-bill dispute without a reason was accepted");
  const disputedBill = await api.functional.vendor_bill_status.status(owner, bill.id, { status: "disputed", reason: "Quantity mismatch" });
  const resolvedBill = await api.functional.vendor_bill_status.status(owner, bill.id, { status: "posted", reason: "Supplier confirmed quantity" });
  const voidBill = await api.functional.vendor_bill_status.status(owner, bill.id, { status: "void" });
  const payment = await api.functional.vendor_payment_create.create(owner, { vendorId: vendor.id, paymentDate: "2026-08-06T00:00:00.000Z", amount: 100 });
  await api.functional.vendor_payment_status.status(owner, payment.id, { status: "approved" });
  const postedPayment = await api.functional.vendor_payment_status.status(owner, payment.id, { status: "posted" });
  const reversedPayment = await api.functional.vendor_payment_status.status(owner, payment.id, { status: "reversed" });
  const credit = await api.functional.vendor_credit_create.create(owner, { vendorId: vendor.id, amount: 25 });
  await api.functional.vendor_credit_status.status(owner, credit.id, { status: "approved" });
  const settledCredit = await api.functional.vendor_credit_status.status(owner, credit.id, { status: "settled" });
  const accountRows = await api.functional.account_search.index(owner, { accountType: "asset" });
  const refundBank = await api.functional.bank_account_create.create(owner, { institutionName: "Refund Bank", accountReference: `REF-${suffix}`, currencyCode: "USD", openingBalance: 0, ledgerAccountId: accountRows.data[0]!.id });
  const refundableCredit = await api.functional.vendor_credit_create.create(owner, { vendorId: vendor.id, amount: 25 });
  await api.functional.vendor_credit_status.status(owner, refundableCredit.id, { status: "approved" });
  const refundedCredit = await api.functional.vendor_credit_status.status(owner, refundableCredit.id, { status: "refunded", refundBankAccountId: refundBank.id });
  if (postedReceipt.status !== "posted" || postedBill.status !== "posted" || disputedBill.disputeReason !== "Quantity mismatch" || resolvedBill.resolutionReason !== "Supplier confirmed quantity" || voidBill.status !== "void" || postedPayment.status !== "posted" || reversedPayment.status !== "reversed" || settledCredit.status !== "settled" || refundedCredit.status !== "refunded" || refundedCredit.refundBankAccountId !== refundBank.id || refundedCredit.refundedAt === null) throw new Error("procurement settlement state was not retained");
}
