import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves the purchase-request, purchase-order, vendor-bill, and payment state journeys. */
export async function test_api_procurement(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-proc`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `Proc ${suffix}`, code: `proc-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("procurement membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const vendor = await api.functional.organization.vendor.createVendor(owner, { name: `Vendor ${suffix}` });
  const request = await api.functional.organization.purchase_request.createRequest(owner, { vendor_id: vendor.id, total: 125, lines_json: "[{\"sku\":\"A\",\"quantity\":1}]" }); typia.assert(request);
  await api.functional.organization.purchase_request.submit.submitRequest(owner, request.id);
  const approved = await api.functional.organization.purchase_request.approve.approveRequest(owner, request.id); if (approved.status !== "approved") throw new Error("purchase request did not approve");
  const order = await api.functional.organization.purchase_order.createOrder(owner, { vendor_id: vendor.id, source_request_id: request.id, total: 125 });
  await api.functional.organization.purchase_order.submit.submitOrder(owner, order.id);
  await api.functional.organization.purchase_order.approve.approveOrder(owner, order.id);
  const sent = await api.functional.organization.purchase_order.send.sendOrder(owner, order.id); if (sent.status !== "sent") throw new Error("purchase order did not send");
  const bill = await api.functional.organization.vendor_bill.createBill(owner, { vendor_id: vendor.id, source_order_id: order.id, total: 125 });
  await api.functional.organization.vendor_bill.match.matchBill(owner, bill.id);
  await api.functional.organization.vendor_bill.approve.approveBill(owner, bill.id);
  const posted = await api.functional.organization.vendor_bill.post.postBill(owner, bill.id); if (posted.status !== "posted") throw new Error("vendor bill did not post");
  const payment = await api.functional.organization.vendor_payment.createPayment(owner, { vendor_id: vendor.id, total: 125, allocations_json: `[{\"billId\":\"${bill.id}\",\"amount\":125}]` });
  const settled = await api.functional.organization.vendor_payment.post.postPayment(owner, payment.id); if (settled.status !== "posted") throw new Error("vendor payment did not post");
}
