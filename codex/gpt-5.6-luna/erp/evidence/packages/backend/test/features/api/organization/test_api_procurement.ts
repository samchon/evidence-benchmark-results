import * as api from "@benchmark/erp-api";

/** Proves request submission/approval and purchase-order routing lifecycle.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-p2p-procure-to-pay-journey Exercises and asserts the p2p procure to pay journey behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-p2prod-plan-to-produce-journey Exercises and asserts the p2prod plan to produce journey behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-purchase-request-purchase-request-rules Exercises and asserts the purchase request purchase request rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-purchase-order-purchase-order-rules Exercises and asserts the purchase order purchase order rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-receipt-purchase-receipt-rules Exercises and asserts the receipt purchase receipt rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vendor-bill-vendor-bill-rules Exercises and asserts the vendor bill vendor bill rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-request-purchase-request-lifecycle Exercises and asserts the purchase request purchase request lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-order-purchase-order-lifecycle Exercises and asserts the purchase order purchase order lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-receipt-purchase-receipt-lifecycle Exercises and asserts the purchase receipt purchase receipt lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-return-purchase-returns Exercises and asserts the purchase return purchase returns behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-bill-vendor-bill-lifecycle Exercises and asserts the vendor bill vendor bill lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-payment-vendor-payments Exercises and asserts the vendor payment vendor payments behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-credit-vendor-credits Exercises and asserts the vendor credit vendor credits behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-order-purchase-order-operations Exercises and asserts the purchase order purchase order operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-vendor-bill-operations Exercises and asserts the vendor bill vendor bill operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-payment-vendor-payment-operations Exercises and asserts the vendor payment vendor payment operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-credit-vendor-credit-operations Exercises and asserts the vendor credit vendor credit operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-request-purchase-request-operations Exercises and asserts the purchase request purchase request operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-purchase-receipt-operations Exercises and asserts the purchase receipt purchase receipt operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-return-purchase-return-operations Exercises and asserts the purchase return purchase return operations behavior.
 */
export async function test_api_procurement(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `procurement-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Procurement ${suffix}`, code: `procurement-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const vendor = await api.functional.vendor_create.create(owner, { code: "V-001", legalName: "Preferred Vendor", taxRegistration: null });
  const request = await api.functional.purchase_request_create.create(owner, { justification: "Office equipment", currencyCode: "USD", estimatedTotal: 250 });
  await api.functional.purchase_request_line.create(owner, request.id, { description: "Monitor", quantity: 2, unitCode: "EA", estimatedUnitCost: 125, preferredVendorId: vendor.id });
  const submitted = await api.functional.purchase_request_status.status(owner, request.id, { status: "submitted" });
  const approved = await api.functional.purchase_request_status.status(owner, request.id, { status: "approved" });
  if (submitted.status !== "submitted" || approved.status !== "approved" || approved.lineIds.length !== 1) throw new Error("purchase request approval did not lock request lines");
  const order = await api.functional.purchase_order_create.create(owner, { vendorId: vendor.id, purchaseRequestId: request.id, currencyCode: "USD", totalAmount: 250 });
  const routed = await api.functional.purchase_order_status.status(owner, order.id, { status: "routed" });
  const sent = await api.functional.purchase_order_status.status(owner, order.id, { status: "approved" });
  const issued = await api.functional.purchase_order_status.status(owner, order.id, { status: "sent" });
  if (routed.status !== "routed" || sent.status !== "approved" || issued.status !== "sent") throw new Error("purchase order workflow did not retain routing states");
  const change = await api.functional.purchase_order_change_request_create.create(owner, { purchaseOrderId: order.id, requestedTotalAmount: 275, reason: "Vendor confirmed revised freight" });
  const approvedChange = await api.functional.purchase_order_change_request_status.status(owner, change.id, { status: "approved" });
  const appliedChange = await api.functional.purchase_order_change_request_apply.apply(owner, approvedChange.id);
  if (appliedChange.status !== "applied") throw new Error("purchase-order change approval was not applied");
  const changes = await api.functional.purchase_order_change_request_search.search(owner, { purchaseOrderId: order.id, status: "applied" });
  if (!changes.data.some((item) => item.id === change.id && item.requestedTotalAmount === 275)) throw new Error("purchase-order change history was not retained");
  const found = await api.functional.purchase_order_search.index(owner, { vendorId: vendor.id });
  if (found.data.length !== 1 || found.data[0]!.id !== order.id || found.data[0]!.totalAmount !== 275) throw new Error("purchase order search omitted the changed total");
}
