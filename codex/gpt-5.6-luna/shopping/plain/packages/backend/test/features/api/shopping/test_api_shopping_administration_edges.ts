import * as api from "@benchmark/shopping-api";
import typia from "typia";

import { MySetupWizard } from "../../../../src/setup/MySetupWizard";
import { TestAutomation } from "../../../helpers/TestAutomation";

function email(label: string): string {
  return `${label}.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`;
}

async function rejected(task: () => Promise<unknown>): Promise<void> {
  try {
    await task();
  } catch {
    return;
  }
  throw new Error("The operation unexpectedly succeeded.");
}

function isOrder(value: api.IShoppingOrder | { status: "failed" | "unknown" }): value is api.IShoppingOrder {
  return "items" in value;
}

/** Proves administrator force paths, rejection/reapplication, and lifecycle edges. */
export async function test_api_shopping_administration_edges(
  connection: api.IConnection,
): Promise<void> {
  const admin = TestAutomation.adminConnection();
  await rejected(() =>
    api.functional.shopping.customer.account.customerDelete(admin, {
      password: "bootstrap123",
    }),
  );
  const seller = { host: connection.host } satisfies api.IConnection;
  const sellerCredentials = { email: email("edge-seller"), password: "seller1234" } satisfies api.IShoppingSeller.IJoin;
  const joinedSeller = await api.functional.shopping.auth.seller.join.sellerJoin(seller, sellerCredentials);
  typia.assert(joinedSeller);
  const ownProfile = await api.functional.shopping.seller.profile.sellerOwnProfile(seller);
  typia.assert(ownProfile);
  const sellerApplication = await api.functional.shopping.seller.administrator_application.sellerApply(
    seller,
    { reason: "I can help review seller applications" },
  );
  typia.assert(sellerApplication);
  const sellerApplications = await api.functional.shopping.seller.administrator_application.sellerApplications(
    seller,
    { page: 1, limit: 0 },
  );
  typia.assert(sellerApplications);
  const rejectedApplication = await api.functional.shopping.admin.administrator_application.reject.applicationReject(
    admin,
    sellerApplication.id,
  );
  typia.assert(rejectedApplication);
  if (rejectedApplication.status !== "rejected")
    throw new Error("Seller administrator application rejection did not persist.");
  const pending = await api.functional.shopping.admin.approval.seller.sellerApprovalIndex(admin, { page: 1, limit: 0 });
  typia.assert(pending);
  const firstRequest = pending.data.find((item) => item.sellerId === joinedSeller.actor.id);
  if (firstRequest === undefined) throw new Error("Edge seller approval was not queued.");
  const rejectedStatus = await api.functional.shopping.admin.approval.seller.reject.sellerReject(admin, firstRequest.id, { reason: "Needs a clearer shop proposal" });
  typia.assert(rejectedStatus);
  if (rejectedStatus.approvalState !== "rejected") throw new Error("Seller rejection did not persist.");
  const sellerStatus = await api.functional.shopping.seller.approval.sellerStatus(seller);
  typia.assert(sellerStatus);
  if (sellerStatus.rejectionReason !== "Needs a clearer shop proposal") throw new Error("Seller rejection reason was not retained.");
  const resubmitted = await api.functional.shopping.seller.approval.sellerResubmit(seller);
  typia.assert(resubmitted);
  if (resubmitted.approvalState !== "pending") throw new Error("Seller resubmission did not reopen approval.");
  const secondQueue = await api.functional.shopping.admin.approval.seller.sellerApprovalIndex(admin, { page: 1, limit: 0 });
  const secondRequest = secondQueue.data.find((item) => item.sellerId === joinedSeller.actor.id);
  if (secondRequest === undefined) throw new Error("Seller resubmission was not queued.");
  await api.functional.shopping.admin.approval.seller.approve.sellerApprove(admin, secondRequest.id);

  const sellerRefresh = { host: connection.host } satisfies api.IConnection;
  const refreshedSeller = await api.functional.shopping.auth.seller.refresh.sellerRefresh(sellerRefresh, { refreshToken: joinedSeller.token.refresh });
  typia.assert(refreshedSeller);
  if (refreshedSeller.actor.type !== "seller" || refreshedSeller.token.access.length === 0)
    throw new Error("Seller refresh did not restore a seller session.");
  await api.functional.shopping.seller.auth.sessions.sellerLogoutAll(sellerRefresh);
  const sellerAfterLogout = { host: connection.host } satisfies api.IConnection;
  const sellerLogin = await api.functional.shopping.auth.seller.login.sellerLogin(sellerAfterLogout, sellerCredentials);
  typia.assert(sellerLogin);
  const sellerRecovery = await api.functional.shopping.auth.seller.password.recovery.sellerRecoveryRequest({ host: connection.host }, { email: sellerCredentials.email });
  typia.assert(sellerRecovery);
  if (sellerRecovery.accepted !== true) throw new Error("Seller recovery was not accepted.");
  const delivery = await MySetupWizard.latestRecoveryDelivery(sellerCredentials.email);
  if (delivery.recipient !== sellerCredentials.email || delivery.kind !== "passwordRecovery") throw new Error("Seller recovery delivery was addressed incorrectly.");
  await api.functional.shopping.auth.seller.password.recovery.sellerRecoveryComplete({ host: connection.host }, { token: delivery.payload.token, newPassword: "sellerrecovered" });
  const sellerForWork = { host: connection.host } satisfies api.IConnection;
  const recoveredSeller = await api.functional.shopping.auth.seller.login.sellerLogin(sellerForWork, { email: sellerCredentials.email, password: "sellerrecovered" });
  typia.assert(recoveredSeller);

  const customerConnection = { host: connection.host } satisfies api.IConnection;
  const customerCredentials = { email: email("edge-customer"), password: "customer123" } satisfies api.IShoppingCustomer.IJoin;
  const joinedCustomer = await api.functional.shopping.auth.customer.join.customerJoin(customerConnection, customerCredentials);
  typia.assert(joinedCustomer);
  const customer = { host: connection.host } satisfies api.IConnection;
  const refreshedCustomer = await api.functional.shopping.auth.customer.refresh.customerRefresh(customer, { refreshToken: joinedCustomer.token.refresh });
  typia.assert(refreshedCustomer);
  const address = await api.functional.shopping.customer.address.addressCreate(customer, { recipientName: "Edge Customer", recipientPhone: "+821011111111", streetAddress: "2 Commerce Road", city: "Seoul", stateOrProvince: "Seoul", postalCode: "04501", country: "KR" });
  typia.assert(address);
  await api.functional.shopping.customer.address._default.addressDefault(customer, address.id);

  const category = await api.functional.shopping.admin.category.categoryCreate(admin, { name: "Edge", description: "Edge products" });
  typia.assert(category);
  const product = await api.functional.shopping.seller.product.productCreate(sellerForWork, { name: "Force Mug", description: "Force test", categoryId: category.id, basePrice: 8 });
  typia.assert(product);
  const variant = await api.functional.shopping.seller.product.variant.variantCreate(sellerForWork, product.id, { sku: `EDGE-${Date.now()}`, options: { Color: "Blue" } });
  typia.assert(variant);
  await api.functional.shopping.seller.product.variant.restock(sellerForWork, variant.id, { quantity: 5, reason: "edge stock" });
  const categoryProducts = await api.functional.shopping.customer.category.product.categoryProducts(customer, category.id, { page: 1, limit: 0 });
  typia.assert(categoryProducts);
  if (!categoryProducts.data.some((item) => item.id === product.id)) throw new Error("Category product browsing missed the live product.");

  await api.functional.shopping.customer.cart.cartAdd(customer, variant.id, { quantity: 1 });
  const checkout = await api.functional.shopping.customer.checkout.checkout(customer, { addressId: address.id });
  const paid = await api.functional.shopping.customer.checkout.payment(customer, { attemptId: checkout.attemptId, success: true, amount: checkout.totalPrice });
  typia.assert(paid);
  if (!isOrder(paid)) throw new Error("Force-cancel order was not created.");
  const cancelled = await api.functional.shopping.admin.order.cancel.forceCancelOrder(admin, paid.id, { reason: "Whole-order cancellation" });
  typia.assert(cancelled);
  if (cancelled.items[0]?.status !== "cancelled") throw new Error("Whole-order force cancellation did not resolve the item.");

  await api.functional.shopping.customer.cart.cartAdd(customer, variant.id, { quantity: 1 });
  const refundCheckout = await api.functional.shopping.customer.checkout.checkout(customer, { addressId: address.id });
  const refundPaid = await api.functional.shopping.customer.checkout.payment(customer, { attemptId: refundCheckout.attemptId, success: true, amount: refundCheckout.totalPrice });
  typia.assert(refundPaid);
  if (!isOrder(refundPaid)) throw new Error("Force-refund order was not created.");
  const refunded = await api.functional.shopping.admin.order.refund.forceRefundOrder(admin, refundPaid.id, { reason: "Whole-order refund" });
  typia.assert(refunded);
  if (refunded.items[0]?.status !== "refunded") throw new Error("Whole-order force refund did not resolve the item.");
  const forceOrder = await api.functional.shopping.admin.order.adminOrderAt(admin, paid.id);
  typia.assert(forceOrder);
  if (forceOrder.items[0]?.status !== "cancelled")
    throw new Error("Administrative order detail did not retain the cancelled item state.");

  const policyProduct = await api.functional.shopping.seller.product.productCreate(sellerForWork, { name: "Policy Product", description: "To be moderated", categoryId: category.id, basePrice: 3 });
  typia.assert(policyProduct);
  const policyDeleted = await api.functional.shopping.admin.product.productPolicyDelete(admin, policyProduct.id, { reason: "Policy violation" });
  typia.assert(policyDeleted);
  if (policyDeleted.success !== true) throw new Error("Policy product deletion did not complete.");

  const disposableSeller = { host: connection.host } satisfies api.IConnection;
  const disposableCredentials = { email: email("disposable-seller"), password: "seller1234" } satisfies api.IShoppingSeller.IJoin;
  const disposable = await api.functional.shopping.auth.seller.join.sellerJoin(disposableSeller, disposableCredentials);
  typia.assert(disposable);
  await api.functional.shopping.admin.seller.ban.sellerBan(admin, disposable.actor.id);
  await rejected(() => api.functional.shopping.auth.seller.login.sellerLogin({ host: connection.host }, disposableCredentials));
  await api.functional.shopping.admin.seller.unban.sellerUnban(admin, disposable.actor.id);
  const disposableQueue = await api.functional.shopping.admin.approval.seller.sellerApprovalIndex(admin, { page: 1, limit: 0 });
  typia.assert(disposableQueue);
  const disposableRequest = disposableQueue.data.find((item) => item.sellerId === disposable.actor.id);
  if (disposableRequest === undefined) throw new Error("Disposable seller approval was not queued.");
  await api.functional.shopping.admin.approval.seller.approve.sellerApprove(admin, disposableRequest.id);
  const disposableLogin = { host: connection.host } satisfies api.IConnection;
  await api.functional.shopping.auth.seller.login.sellerLogin(disposableLogin, disposableCredentials);
  const deletionCategory = await api.functional.shopping.admin.category.categoryCreate(admin, { name: "Seller deletion evidence", description: "Retained movement test" });
  typia.assert(deletionCategory);
  const deletionProduct = await api.functional.shopping.seller.product.productCreate(disposableLogin, { name: "Retained stock product", description: "Seller closure evidence", categoryId: deletionCategory.id, basePrice: 4 });
  typia.assert(deletionProduct);
  const deletionVariant = await api.functional.shopping.seller.product.variant.variantCreate(disposableLogin, deletionProduct.id, { sku: `DELETE-${Date.now()}`, options: { State: "Retained" } });
  typia.assert(deletionVariant);
  await api.functional.shopping.seller.product.variant.restock(disposableLogin, deletionVariant.id, { quantity: 2, reason: "retained before closure" });
  const movementCountBeforeSellerClosure = await MySetupWizard.inventoryMovementCount(deletionVariant.id);
  await api.functional.shopping.seller.account.sellerDelete(disposableLogin, { password: disposableCredentials.password });
  const movementCountAfterSellerClosure = await MySetupWizard.inventoryMovementCount(deletionVariant.id);
  if (movementCountAfterSellerClosure !== 0 || movementCountBeforeSellerClosure === 0)
    throw new Error("Seller closure did not remove the retired working inventory ledger.");
  const sellerClosureSnapshots = await api.functional.shopping.admin.product.snapshot.adminProductSnapshots(admin, deletionProduct.id, { page: 1, limit: 0 });
  typia.assert(sellerClosureSnapshots);
  if (!sellerClosureSnapshots.data.some((item) => item.changed.includes("deletedAt") && item.before !== undefined && item.after !== undefined))
    throw new Error("Seller closure did not retain a complete product deletion snapshot.");
  await rejected(() => api.functional.shopping.auth.seller.login.sellerLogin({ host: connection.host }, disposableCredentials));

  await api.functional.shopping.customer.auth.sessions.customerLogoutAll(customer);
}
