import * as api from "@benchmark/shopping-api";
import typia, { tags } from "typia";

async function expectUnauthenticated(name: string, call: () => Promise<unknown>): Promise<void> {
  try {
    await call();
    throw new Error(`${name} unexpectedly succeeded without authentication`);
  } catch (error) {
    if (!(error instanceof api.HttpError) || error.status !== 401) throw error;
  }
}

/** Proves the health operation responds through the live backend. */
export async function test_api_operation_api_functional_health_get(connection: api.IConnection): Promise<void> {
  const result = await api.functional.health.get(connection);
  typia.assert(result);
}

/** Proves the api.functional.shopping.admin.action.adminActions actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_action_adminActions(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.action.adminActions", () => api.functional.shopping.admin.action.adminActions(connection, {}));
}

/** Proves the api.functional.shopping.admin.admin_application.approve.adminApplicationApprove actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_admin_application_approve_adminApplicationApprove(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.admin_application.approve.adminApplicationApprove", () => api.functional.shopping.admin.admin_application.approve.adminApplicationApprove(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.admin_application.adminApplicationsPending actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_admin_application_adminApplicationsPending(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.admin_application.adminApplicationsPending", () => api.functional.shopping.admin.admin_application.adminApplicationsPending(connection, {}));
}

/** Proves the api.functional.shopping.admin.admin_application.reject.adminApplicationReject actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_admin_application_reject_adminApplicationReject(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.admin_application.reject.adminApplicationReject", () => api.functional.shopping.admin.admin_application.reject.adminApplicationReject(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.category.categoryCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_category_categoryCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.category.categoryCreate", () => api.functional.shopping.admin.category.categoryCreate(connection, typia.random<api.functional.shopping.admin.category.categoryCreate.Body>()));
}

/** Proves the api.functional.shopping.admin.category.categoryUpdate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_category_categoryUpdate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.category.categoryUpdate", () => api.functional.shopping.admin.category.categoryUpdate(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.admin.category.categoryUpdate.Body>()));
}

/** Proves the api.functional.shopping.admin.category.categoryDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_category_categoryDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.category.categoryDelete", () => api.functional.shopping.admin.category.categoryDelete(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.customer.ban.adminCustomerBan actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_customer_ban_adminCustomerBan(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.customer.ban.adminCustomerBan", () => api.functional.shopping.admin.customer.ban.adminCustomerBan(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.customer.adminCustomers actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_customer_adminCustomers(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.customer.adminCustomers", () => api.functional.shopping.admin.customer.adminCustomers(connection, {}));
}

/** Proves the api.functional.shopping.admin.customer.unban.adminCustomerUnban actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_customer_unban_adminCustomerUnban(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.customer.unban.adminCustomerUnban", () => api.functional.shopping.admin.customer.unban.adminCustomerUnban(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.grade.demote.adminGradeDemote actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_grade_demote_adminGradeDemote(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.grade.demote.adminGradeDemote", () => api.functional.shopping.admin.grade.demote.adminGradeDemote(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.grade.promote.adminGradePromote actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_grade_promote_adminGradePromote(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.grade.promote.adminGradePromote", () => api.functional.shopping.admin.grade.promote.adminGradePromote(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.order.cancel.forceCancelOrder actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_order_cancel_forceCancelOrder(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.order.cancel.forceCancelOrder", () => api.functional.shopping.admin.order.cancel.forceCancelOrder(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.admin.order.cancel.forceCancelOrder.Body>()));
}

/** Proves the api.functional.shopping.admin.order.adminOrderList actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_order_adminOrderList(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.order.adminOrderList", () => api.functional.shopping.admin.order.adminOrderList(connection, {}));
}

/** Proves the api.functional.shopping.admin.order.adminOrderAt actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_order_adminOrderAt(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.order.adminOrderAt", () => api.functional.shopping.admin.order.adminOrderAt(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.order.refund.forceRefundOrder actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_order_refund_forceRefundOrder(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.order.refund.forceRefundOrder", () => api.functional.shopping.admin.order.refund.forceRefundOrder(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.admin.order.refund.forceRefundOrder.Body>()));
}

/** Proves the api.functional.shopping.admin.order_item.cancel.forceCancelItem actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_order_item_cancel_forceCancelItem(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.order_item.cancel.forceCancelItem", () => api.functional.shopping.admin.order_item.cancel.forceCancelItem(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.admin.order_item.cancel.forceCancelItem.Body>()));
}

/** Proves the api.functional.shopping.admin.order_item.refund.forceRefundItem actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_order_item_refund_forceRefundItem(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.order_item.refund.forceRefundItem", () => api.functional.shopping.admin.order_item.refund.forceRefundItem(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.admin.order_item.refund.forceRefundItem.Body>()));
}

/** Proves the api.functional.shopping.admin.product.adminProducts actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_product_adminProducts(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.product.adminProducts", () => api.functional.shopping.admin.product.adminProducts(connection, {}));
}

/** Proves the api.functional.shopping.admin.product.adminProductAt actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_product_adminProductAt(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.product.adminProductAt", () => api.functional.shopping.admin.product.adminProductAt(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.product.adminProductDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_product_adminProductDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.product.adminProductDelete", () => api.functional.shopping.admin.product.adminProductDelete(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.admin.product.adminProductDelete.Body>()));
}

/** Proves the api.functional.shopping.admin.product.snapshot.adminProductSnapshots actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_product_snapshot_adminProductSnapshots(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.product.snapshot.adminProductSnapshots", () => api.functional.shopping.admin.product.snapshot.adminProductSnapshots(connection, typia.random<string & tags.Format<"uuid">>(), {}));
}

/** Proves the api.functional.shopping.admin.seller.approval.approve.sellerApprove actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_approval_approve_sellerApprove(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.approval.approve.sellerApprove", () => api.functional.shopping.admin.seller.approval.approve.sellerApprove(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.seller.approval.sellerApprovals actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_approval_sellerApprovals(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.approval.sellerApprovals", () => api.functional.shopping.admin.seller.approval.sellerApprovals(connection, {}));
}

/** Proves the api.functional.shopping.admin.seller.approval.reject.sellerReject actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_approval_reject_sellerReject(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.approval.reject.sellerReject", () => api.functional.shopping.admin.seller.approval.reject.sellerReject(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.admin.seller.approval.reject.sellerReject.Body>()));
}

/** Proves the api.functional.shopping.admin.seller.ban.adminSellerBan actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_ban_adminSellerBan(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.ban.adminSellerBan", () => api.functional.shopping.admin.seller.ban.adminSellerBan(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.seller.adminSellers actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_adminSellers(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.adminSellers", () => api.functional.shopping.admin.seller.adminSellers(connection, {}));
}

/** Proves the api.functional.shopping.admin.seller.snapshot.adminSellerProfileSnapshots actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_snapshot_adminSellerProfileSnapshots(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.snapshot.adminSellerProfileSnapshots", () => api.functional.shopping.admin.seller.snapshot.adminSellerProfileSnapshots(connection, typia.random<string & tags.Format<"uuid">>(), {}));
}

/** Proves the api.functional.shopping.admin.seller.suspend.sellerSuspend actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_suspend_sellerSuspend(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.suspend.sellerSuspend", () => api.functional.shopping.admin.seller.suspend.sellerSuspend(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.seller.unban.adminSellerUnban actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_unban_adminSellerUnban(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.unban.adminSellerUnban", () => api.functional.shopping.admin.seller.unban.adminSellerUnban(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_admin_seller_unsuspend_sellerUnsuspend(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend", () => api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the customer join operation accepts a complete credential payload. */
export async function test_api_operation_api_functional_shopping_auth_customer_join_customerJoin(connection: api.IConnection): Promise<void> {
  const result = await api.functional.shopping.auth.customer.join.customerJoin(connection, { email: `customer-operation-1785903539375-${Math.random().toString(16).slice(2)}@example.com`, password: "password-123" });
  typia.assert(result);
}

/** Proves the api.functional.shopping.auth.customer.login.customerLogin actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_auth_customer_login_customerLogin(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.auth.customer.login.customerLogin", () => api.functional.shopping.auth.customer.login.customerLogin(connection, typia.random<api.functional.shopping.auth.customer.login.customerLogin.Body>()));
}

/** Proves the api.functional.shopping.auth.customer.recovery.customerRecoveryRequest actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_auth_customer_recovery_customerRecoveryRequest(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.auth.customer.recovery.customerRecoveryRequest", () => api.functional.shopping.auth.customer.recovery.customerRecoveryRequest(connection, typia.random<api.functional.shopping.auth.customer.recovery.customerRecoveryRequest.Body>()));
}

/** Proves the api.functional.shopping.auth.customer.recovery.customerRecoveryComplete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_auth_customer_recovery_customerRecoveryComplete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.auth.customer.recovery.customerRecoveryComplete", () => api.functional.shopping.auth.customer.recovery.customerRecoveryComplete(connection, typia.random<api.functional.shopping.auth.customer.recovery.customerRecoveryComplete.Body>()));
}

/** Proves the api.functional.shopping.auth.customer.refresh.customerRefresh actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_auth_customer_refresh_customerRefresh(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.auth.customer.refresh.customerRefresh", () => api.functional.shopping.auth.customer.refresh.customerRefresh(connection, typia.random<api.functional.shopping.auth.customer.refresh.customerRefresh.Body>()));
}

/** Proves the seller join operation accepts a complete credential payload. */
export async function test_api_operation_api_functional_shopping_auth_seller_join_sellerJoin(connection: api.IConnection): Promise<void> {
  const result = await api.functional.shopping.auth.seller.join.sellerJoin(connection, { email: `seller-operation-1785903539375-${Math.random().toString(16).slice(2)}@example.com`, password: "password-123" });
  typia.assert(result);
}

/** Proves the api.functional.shopping.auth.seller.login.sellerLogin actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_auth_seller_login_sellerLogin(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.auth.seller.login.sellerLogin", () => api.functional.shopping.auth.seller.login.sellerLogin(connection, typia.random<api.functional.shopping.auth.seller.login.sellerLogin.Body>()));
}

/** Proves the api.functional.shopping.auth.seller.recovery.sellerRecoveryRequest actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_auth_seller_recovery_sellerRecoveryRequest(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.auth.seller.recovery.sellerRecoveryRequest", () => api.functional.shopping.auth.seller.recovery.sellerRecoveryRequest(connection, typia.random<api.functional.shopping.auth.seller.recovery.sellerRecoveryRequest.Body>()));
}

/** Proves the api.functional.shopping.auth.seller.recovery.sellerRecoveryComplete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_auth_seller_recovery_sellerRecoveryComplete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.auth.seller.recovery.sellerRecoveryComplete", () => api.functional.shopping.auth.seller.recovery.sellerRecoveryComplete(connection, typia.random<api.functional.shopping.auth.seller.recovery.sellerRecoveryComplete.Body>()));
}

/** Proves the api.functional.shopping.auth.seller.refresh.sellerRefresh actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_auth_seller_refresh_sellerRefresh(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.auth.seller.refresh.sellerRefresh", () => api.functional.shopping.auth.seller.refresh.sellerRefresh(connection, typia.random<api.functional.shopping.auth.seller.refresh.sellerRefresh.Body>()));
}

/** Proves the api.functional.shopping.customer.account.customerAccountDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_account_customerAccountDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.account.customerAccountDelete", () => api.functional.shopping.customer.account.customerAccountDelete(connection, typia.random<api.functional.shopping.customer.account.customerAccountDelete.Body>()));
}

/** Proves the api.functional.shopping.customer.address.customerAddresses actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_address_customerAddresses(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.address.customerAddresses", () => api.functional.shopping.customer.address.customerAddresses(connection, {}));
}

/** Proves the api.functional.shopping.customer.address.customerAddressCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_address_customerAddressCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.address.customerAddressCreate", () => api.functional.shopping.customer.address.customerAddressCreate(connection, typia.random<api.functional.shopping.customer.address.customerAddressCreate.Body>()));
}

/** Proves the api.functional.shopping.customer.address.customerAddressUpdate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_address_customerAddressUpdate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.address.customerAddressUpdate", () => api.functional.shopping.customer.address.customerAddressUpdate(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.customer.address.customerAddressUpdate.Body>()));
}

/** Proves the api.functional.shopping.customer.address.customerAddressDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_address_customerAddressDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.address.customerAddressDelete", () => api.functional.shopping.customer.address.customerAddressDelete(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.address._default.customerAddressDefault actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_address__default_customerAddressDefault(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.address._default.customerAddressDefault", () => api.functional.shopping.customer.address._default.customerAddressDefault(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.admin_application.adminApplicationCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_admin_application_adminApplicationCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.admin_application.adminApplicationCreate", () => api.functional.shopping.customer.admin_application.adminApplicationCreate(connection, typia.random<api.functional.shopping.customer.admin_application.adminApplicationCreate.Body>()));
}

/** Proves the api.functional.shopping.customer.admin_application.adminApplications actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_admin_application_adminApplications(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.admin_application.adminApplications", () => api.functional.shopping.customer.admin_application.adminApplications(connection, {}));
}

/** Proves the api.functional.shopping.customer.cancellation.cancellationCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_cancellation_cancellationCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.cancellation.cancellationCreate", () => api.functional.shopping.customer.cancellation.cancellationCreate(connection, typia.random<api.functional.shopping.customer.cancellation.cancellationCreate.Body>()));
}

/** Proves the api.functional.shopping.customer.cart.cart actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_cart_cart(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.cart.cart", () => api.functional.shopping.customer.cart.cart(connection));
}

/** Proves the api.functional.shopping.customer.cart.cartAdd actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_cart_cartAdd(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.cart.cartAdd", () => api.functional.shopping.customer.cart.cartAdd(connection, typia.random<api.functional.shopping.customer.cart.cartAdd.Body>()));
}

/** Proves the api.functional.shopping.customer.cart.cartUpdate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_cart_cartUpdate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.cart.cartUpdate", () => api.functional.shopping.customer.cart.cartUpdate(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.customer.cart.cartUpdate.Body>()));
}

/** Proves the api.functional.shopping.customer.cart.cartDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_cart_cartDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.cart.cartDelete", () => api.functional.shopping.customer.cart.cartDelete(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.category.categories actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_category_categories(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.category.categories", () => api.functional.shopping.customer.category.categories(connection));
}

/** Proves the api.functional.shopping.customer.category.product.categoryProducts actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_category_product_categoryProducts(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.category.product.categoryProducts", () => api.functional.shopping.customer.category.product.categoryProducts(connection, typia.random<string & tags.Format<"uuid">>(), {}));
}

/** Proves the api.functional.shopping.customer.checkout.checkoutReview actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_checkout_checkoutReview(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.checkout.checkoutReview", () => api.functional.shopping.customer.checkout.checkoutReview(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.checkout.payment.checkoutPayment actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_checkout_payment_checkoutPayment(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.checkout.payment.checkoutPayment", () => api.functional.shopping.customer.checkout.payment.checkoutPayment(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.customer.checkout.payment.checkoutPayment.Body>()));
}

/** Proves the api.functional.shopping.customer.checkout.start.checkoutStart actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_checkout_start_checkoutStart(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.checkout.start.checkoutStart", () => api.functional.shopping.customer.checkout.start.checkoutStart(connection, typia.random<api.functional.shopping.customer.checkout.start.checkoutStart.Body>()));
}

/** Proves the api.functional.shopping.customer.logout.customerLogout actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_logout_customerLogout(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.logout.customerLogout", () => api.functional.shopping.customer.logout.customerLogout(connection));
}

/** Proves the api.functional.shopping.customer.logout_all.customerLogoutAll actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_logout_all_customerLogoutAll(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.logout_all.customerLogoutAll", () => api.functional.shopping.customer.logout_all.customerLogoutAll(connection));
}

/** Proves the api.functional.shopping.customer.order.orderList actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_order_orderList(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.order.orderList", () => api.functional.shopping.customer.order.orderList(connection, {}));
}

/** Proves the api.functional.shopping.customer.order.orderAt actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_order_orderAt(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.order.orderAt", () => api.functional.shopping.customer.order.orderAt(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.password.customerPassword actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_password_customerPassword(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.password.customerPassword", () => api.functional.shopping.customer.password.customerPassword(connection, typia.random<api.functional.shopping.customer.password.customerPassword.Body>()));
}

/** Proves the api.functional.shopping.customer.product.products actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_product_products(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.product.products", () => api.functional.shopping.customer.product.products(connection, {}));
}

/** Proves the api.functional.shopping.customer.product.productAt actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_product_productAt(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.product.productAt", () => api.functional.shopping.customer.product.productAt(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.profile.customerProfile actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_profile_customerProfile(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.profile.customerProfile", () => api.functional.shopping.customer.profile.customerProfile(connection));
}

/** Proves the api.functional.shopping.customer.profile.customerProfileUpdate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_profile_customerProfileUpdate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.profile.customerProfileUpdate", () => api.functional.shopping.customer.profile.customerProfileUpdate(connection, typia.random<api.functional.shopping.customer.profile.customerProfileUpdate.Body>()));
}

/** Proves the api.functional.shopping.customer.refund.refundCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_refund_refundCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.refund.refundCreate", () => api.functional.shopping.customer.refund.refundCreate(connection, typia.random<api.functional.shopping.customer.refund.refundCreate.Body>()));
}

/** Proves the api.functional.shopping.customer.review.reviewCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_review_reviewCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.review.reviewCreate", () => api.functional.shopping.customer.review.reviewCreate(connection, typia.random<api.functional.shopping.customer.review.reviewCreate.Body>()));
}

/** Proves the api.functional.shopping.customer.review.reviewUpdate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_review_reviewUpdate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.review.reviewUpdate", () => api.functional.shopping.customer.review.reviewUpdate(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.customer.review.reviewUpdate.Body>()));
}

/** Proves the api.functional.shopping.customer.review.reviewDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_review_reviewDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.review.reviewDelete", () => api.functional.shopping.customer.review.reviewDelete(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.shipment.auto_confirm.shipmentAutoConfirm actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_shipment_auto_confirm_shipmentAutoConfirm(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.shipment.auto_confirm.shipmentAutoConfirm", () => api.functional.shopping.customer.shipment.auto_confirm.shipmentAutoConfirm(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.shipment.deliver.shipmentDeliver actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_shipment_deliver_shipmentDeliver(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.shipment.deliver.shipmentDeliver", () => api.functional.shopping.customer.shipment.deliver.shipmentDeliver(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.shipment.shipmentTrack actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_shipment_shipmentTrack(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.shipment.shipmentTrack", () => api.functional.shopping.customer.shipment.shipmentTrack(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.wishlist.wishlist actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_wishlist_wishlist(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.wishlist.wishlist", () => api.functional.shopping.customer.wishlist.wishlist(connection, {}));
}

/** Proves the api.functional.shopping.customer.wishlist.wishlistAdd actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_wishlist_wishlistAdd(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.wishlist.wishlistAdd", () => api.functional.shopping.customer.wishlist.wishlistAdd(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.customer.wishlist.wishlistDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_customer_wishlist_wishlistDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.customer.wishlist.wishlistDelete", () => api.functional.shopping.customer.wishlist.wishlistDelete(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.seller.account.sellerAccountDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_account_sellerAccountDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.account.sellerAccountDelete", () => api.functional.shopping.seller.account.sellerAccountDelete(connection, typia.random<api.functional.shopping.seller.account.sellerAccountDelete.Body>()));
}

/** Proves the api.functional.shopping.seller.logout.sellerLogout actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_logout_sellerLogout(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.logout.sellerLogout", () => api.functional.shopping.seller.logout.sellerLogout(connection));
}

/** Proves the api.functional.shopping.seller.logout_all.sellerLogoutAll actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_logout_all_sellerLogoutAll(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.logout_all.sellerLogoutAll", () => api.functional.shopping.seller.logout_all.sellerLogoutAll(connection));
}

/** Proves the api.functional.shopping.seller.approval.sellerApproval actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_approval_sellerApproval(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.approval.sellerApproval", () => api.functional.shopping.seller.approval.sellerApproval(connection));
}

/** Proves the api.functional.shopping.seller.approval.resubmit.sellerApprovalResubmit actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_approval_resubmit_sellerApprovalResubmit(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.approval.resubmit.sellerApprovalResubmit", () => api.functional.shopping.seller.approval.resubmit.sellerApprovalResubmit(connection));
}

/** Proves the api.functional.shopping.seller.cancellation.cancellationList actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_cancellation_cancellationList(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.cancellation.cancellationList", () => api.functional.shopping.seller.cancellation.cancellationList(connection, {}));
}

/** Proves the api.functional.shopping.seller.dashboard.sellerDashboard actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_dashboard_sellerDashboard(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.dashboard.sellerDashboard", () => api.functional.shopping.seller.dashboard.sellerDashboard(connection));
}

/** Proves the api.functional.shopping.seller.order.shipment.shipmentCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_order_shipment_shipmentCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.order.shipment.shipmentCreate", () => api.functional.shopping.seller.order.shipment.shipmentCreate(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.seller.order.shipment.shipmentCreate.Body>()));
}

/** Proves the api.functional.shopping.seller.order_item.sellerQueue actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_order_item_sellerQueue(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.order_item.sellerQueue", () => api.functional.shopping.seller.order_item.sellerQueue(connection, {}));
}

/** Proves the api.functional.shopping.seller.password.sellerPassword actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_password_sellerPassword(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.password.sellerPassword", () => api.functional.shopping.seller.password.sellerPassword(connection, typia.random<api.functional.shopping.seller.password.sellerPassword.Body>()));
}

/** Proves the api.functional.shopping.seller.product.image.imageUpload actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_image_imageUpload(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.image.imageUpload", () => api.functional.shopping.seller.product.image.imageUpload(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.seller.product.image.imageUpload.Body>()));
}

/** Proves the api.functional.shopping.seller.product.image.imageReorder actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_image_imageReorder(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.image.imageReorder", () => api.functional.shopping.seller.product.image.imageReorder(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.seller.product.image.imageReorder.Body>()));
}

/** Proves the api.functional.shopping.seller.product.image.imageDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_image_imageDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.image.imageDelete", () => api.functional.shopping.seller.product.image.imageDelete(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.seller.product.productCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_productCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.productCreate", () => api.functional.shopping.seller.product.productCreate(connection, typia.random<api.functional.shopping.seller.product.productCreate.Body>()));
}

/** Proves the api.functional.shopping.seller.product.productUpdate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_productUpdate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.productUpdate", () => api.functional.shopping.seller.product.productUpdate(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.seller.product.productUpdate.Body>()));
}

/** Proves the api.functional.shopping.seller.product.productDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_productDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.productDelete", () => api.functional.shopping.seller.product.productDelete(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.seller.product.snapshot.sellerProductSnapshots actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_snapshot_sellerProductSnapshots(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.snapshot.sellerProductSnapshots", () => api.functional.shopping.seller.product.snapshot.sellerProductSnapshots(connection, typia.random<string & tags.Format<"uuid">>(), {}));
}

/** Proves the api.functional.shopping.seller.product.variant.variantCreate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_variant_variantCreate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.variant.variantCreate", () => api.functional.shopping.seller.product.variant.variantCreate(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.seller.product.variant.variantCreate.Body>()));
}

/** Proves the api.functional.shopping.seller.product.variant.variantUpdate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_variant_variantUpdate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.variant.variantUpdate", () => api.functional.shopping.seller.product.variant.variantUpdate(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.seller.product.variant.variantUpdate.Body>()));
}

/** Proves the api.functional.shopping.seller.product.variant.variantDelete actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_variant_variantDelete(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.variant.variantDelete", () => api.functional.shopping.seller.product.variant.variantDelete(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.seller.product.variant.inventory.inventoryAdd actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_variant_inventory_inventoryAdd(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.variant.inventory.inventoryAdd", () => api.functional.shopping.seller.product.variant.inventory.inventoryAdd(connection, typia.random<string & tags.Format<"uuid">>(), typia.random<api.functional.shopping.seller.product.variant.inventory.inventoryAdd.Body>()));
}

/** Proves the api.functional.shopping.seller.product.variant.inventory.inventoryHistory actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_product_variant_inventory_inventoryHistory(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.product.variant.inventory.inventoryHistory", () => api.functional.shopping.seller.product.variant.inventory.inventoryHistory(connection, typia.random<string & tags.Format<"uuid">>(), {}));
}

/** Proves the api.functional.shopping.seller.profile.sellerProfile actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_profile_sellerProfile(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.profile.sellerProfile", () => api.functional.shopping.seller.profile.sellerProfile(connection));
}

/** Proves the api.functional.shopping.seller.profile.sellerProfileUpdate actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_profile_sellerProfileUpdate(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.profile.sellerProfileUpdate", () => api.functional.shopping.seller.profile.sellerProfileUpdate(connection, typia.random<api.functional.shopping.seller.profile.sellerProfileUpdate.Body>()));
}

/** Proves the api.functional.shopping.seller.profile.sellerProfilePublic actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_profile_sellerProfilePublic(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.profile.sellerProfilePublic", () => api.functional.shopping.seller.profile.sellerProfilePublic(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.seller.profile.snapshot.sellerProfileSnapshots actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_profile_snapshot_sellerProfileSnapshots(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.profile.snapshot.sellerProfileSnapshots", () => api.functional.shopping.seller.profile.snapshot.sellerProfileSnapshots(connection, {}));
}

/** Proves the api.functional.shopping.seller.refund.refundList actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_refund_refundList(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.refund.refundList", () => api.functional.shopping.seller.refund.refundList(connection, {}));
}

/** Proves the api.functional.shopping.seller.request.approve.requestApprove actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_request_approve_requestApprove(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.request.approve.requestApprove", () => api.functional.shopping.seller.request.approve.requestApprove(connection, typia.random<string & tags.Format<"uuid">>()));
}

/** Proves the api.functional.shopping.seller.request.reject.requestReject actor guard rejects an unauthenticated caller. */
export async function test_api_operation_api_functional_shopping_seller_request_reject_requestReject(connection: api.IConnection): Promise<void> {
  await expectUnauthenticated("api.functional.shopping.seller.request.reject.requestReject", () => api.functional.shopping.seller.request.reject.requestReject(connection, typia.random<string & tags.Format<"uuid">>()));
}
