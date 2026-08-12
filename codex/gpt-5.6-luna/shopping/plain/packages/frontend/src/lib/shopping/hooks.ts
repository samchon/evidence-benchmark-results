import * as api from "@benchmark/shopping-api";
import type { IConnection } from "@nestia/fetcher";
/* The domain module deliberately centralizes generated calls. The query
 * options are uniform and keyed by domain request objects. */
/* eslint-disable tanstack-query/prefer-query-options */
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiConnection } from "@/lib/client";

type Call<TArgs extends unknown[], TResult> = (connection: IConnection, ...args: TArgs) => Promise<TResult>;

function bind<TArgs extends unknown[], TResult>(call: Call<TArgs, TResult>) {
  return (...args: TArgs): Promise<TResult> => call(apiConnection, ...args);
}

function useAction<TArgs extends unknown[], TResult>(call: Call<TArgs, TResult>, invalidate: () => void) {
  return async (...args: TArgs): Promise<TResult> => {
    const result = await call(apiConnection, ...args);
    invalidate();
    return result;
  };
}

const page = (value?: number): api.IPage.IRequest => ({ page: value ?? 1, limit: 20 });
const addressesRequest: api.IPage.IRequest = { page: 1, limit: 0 };

export const shoppingKeys = {
  all: ["shopping"] as const,
  profile: ["shopping", "profile"] as const,
  catalog: (request: api.IShoppingProduct.IRequest) => ["shopping", "catalog", request] as const,
  product: (id: string) => ["shopping", "product", id] as const,
  cart: ["shopping", "cart"] as const,
  wishlist: (request: api.IPage.IRequest) => ["shopping", "wishlist", request] as const,
  orders: (request: api.IPage.IRequest) => ["shopping", "orders", request] as const,
  order: (id: string) => ["shopping", "order", id] as const,
};

export function useCustomerProfile(enabled = true) {
  return useQuery({ queryKey: shoppingKeys.profile, queryFn: () => api.functional.shopping.customer.profile.customerProfile(apiConnection), enabled });
}

export function useAddresses(enabled = true) {
  return useQuery({ queryKey: ["shopping", "addresses", addressesRequest], queryFn: () => api.functional.shopping.customer.address.addressIndex(apiConnection, addressesRequest), enabled });
}

export function useCategories(enabled = true) {
  return useQuery({ queryKey: ["shopping", "categories"], queryFn: () => api.functional.shopping.customer.category.categoryIndex(apiConnection), enabled });
}

export function useCatalog(request: api.IShoppingProduct.IRequest, enabled = true) {
  return useQuery({ queryKey: shoppingKeys.catalog(request), queryFn: () => api.functional.shopping.customer.product.productIndex(apiConnection, request), enabled });
}

export function useCategoryProducts(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "category", id, request], queryFn: () => api.functional.shopping.customer.category.product.categoryProducts(apiConnection, id, request), enabled });
}

export function useProduct(id: string, enabled = true) {
  return useQuery({ queryKey: shoppingKeys.product(id), queryFn: () => api.functional.shopping.customer.product.productAt(apiConnection, id), enabled: enabled && id.length > 0 });
}

export function useWishlist(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: shoppingKeys.wishlist(request), queryFn: () => api.functional.shopping.customer.wishlist.wishlistIndex(apiConnection, request), enabled });
}

export function useCart(enabled = true) {
  return useQuery({ queryKey: shoppingKeys.cart, queryFn: () => api.functional.shopping.customer.cart.cartAt(apiConnection), enabled });
}

export function useOrders(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: shoppingKeys.orders(request), queryFn: () => api.functional.shopping.customer.order.orderIndex(apiConnection, request), enabled });
}

export function useOrder(id: string, enabled = true) {
  return useQuery({ queryKey: shoppingKeys.order(id), queryFn: () => api.functional.shopping.customer.order.orderAt(apiConnection, id), enabled: enabled && id.length > 0 });
}

export function useOrderSnapshots(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "order-snapshots", id, request], queryFn: () => api.functional.shopping.customer.order.snapshot.orderSnapshots(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useReviewSnapshots(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "review-snapshots", id, request], queryFn: () => api.functional.shopping.customer.review.snapshot.reviewSnapshots(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useSellerProfile(enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "profile"], queryFn: () => api.functional.shopping.seller.profile.sellerOwnProfile(apiConnection), enabled });
}

export function useSellerProfileSnapshots(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "profile-snapshots", request], queryFn: () => api.functional.shopping.seller.profile.snapshot.sellerProfileSnapshots(apiConnection, request), enabled });
}

export function useSellerPublic(id: string, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "public", id], queryFn: () => api.functional.shopping.customer.seller.sellerPublic(apiConnection, id), enabled: enabled && id.length > 0 });
}

export function useSellerStatus(enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "status"], queryFn: () => api.functional.shopping.seller.approval.sellerStatus(apiConnection), enabled });
}

export function useSellerDashboard(enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "dashboard"], queryFn: () => api.functional.shopping.seller.dashboard.dashboard(apiConnection), enabled });
}

export function useSellerItems(request: api.IPage.IRequest & { status?: api.IShoppingOrderItem["status"] | null }, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "items", request], queryFn: () => api.functional.shopping.seller.dashboard.order_item.sellerItems(apiConnection, request), enabled });
}

export function useShippingQueue(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "shipping", request], queryFn: () => api.functional.shopping.seller.order.item.shippingQueue(apiConnection, request), enabled });
}

export function useCancellations(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "cancellations", request], queryFn: () => api.functional.shopping.seller.cancellation.cancellationIndex(apiConnection, request), enabled });
}

export function useRefunds(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "refunds", request], queryFn: () => api.functional.shopping.seller.refund.refundIndex(apiConnection, request), enabled });
}

export function useSellerApplications(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "applications", request], queryFn: () => api.functional.shopping.seller.administrator_application.sellerApplications(apiConnection, request), enabled });
}

export function useCustomerApplications(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "customer", "applications", request], queryFn: () => api.functional.shopping.customer.administrator_application.customerApplications(apiConnection, request), enabled });
}

export function useProductSnapshots(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "product-snapshots", id, request], queryFn: () => api.functional.shopping.seller.product.snapshot.productSnapshots(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useSellerOrderSnapshots(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "seller", "order-snapshots", id, request], queryFn: () => api.functional.shopping.seller.order.snapshot.sellerOrderSnapshots(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useInventory(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "inventory", id, request], queryFn: () => api.functional.shopping.seller.product.variant.inventory(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useAdminSellerApprovals(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "seller-approvals", request], queryFn: () => api.functional.shopping.admin.approval.seller.sellerApprovalIndex(apiConnection, request), enabled });
}

export function useAdminCustomers(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "customers", request], queryFn: () => api.functional.shopping.admin.customer.customerDirectory(apiConnection, request), enabled });
}

export function useAdminSellers(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "sellers", request], queryFn: () => api.functional.shopping.admin.seller.sellerDirectory(apiConnection, request), enabled });
}

export function useAdminProducts(request: api.IShoppingProduct.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "products", request], queryFn: () => api.functional.shopping.admin.product.adminProductIndex(apiConnection, request), enabled });
}

export function useAdminProductSnapshots(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "product-snapshots", id, request], queryFn: () => api.functional.shopping.admin.product.snapshot.adminProductSnapshots(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useAdminOrderSnapshots(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "order-snapshots", id, request], queryFn: () => api.functional.shopping.admin.order.snapshot.adminOrderSnapshots(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useAdminSellerProfileSnapshots(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "seller-snapshots", id, request], queryFn: () => api.functional.shopping.admin.seller.snapshot.adminSellerProfileSnapshots(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useAdminReviewSnapshots(id: string, request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "review-snapshots", id, request], queryFn: () => api.functional.shopping.admin.review.snapshot.adminReviewSnapshots(apiConnection, id, request), enabled: enabled && id.length > 0 });
}

export function useAdminOrders(request: api.IShoppingOrder.IAdminRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "orders", request], queryFn: () => api.functional.shopping.admin.order.adminOrderIndex(apiConnection, request), enabled });
}

export function useAdminOrder(id: string, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "order", id], queryFn: () => api.functional.shopping.admin.order.adminOrderAt(apiConnection, id), enabled: enabled && id.length > 0 });
}

export function useAdminApplications(request: api.IPage.IRequest, enabled = true) {
  return useQuery({ queryKey: ["shopping", "admin", "applications", request], queryFn: () => api.functional.shopping.admin.administrator_application.pendingApplications(apiConnection, request), enabled });
}

/**
 * Complete generated-operation inventory. Every published accessor is bound
 * here so screens can consume the settled SDK through domain hooks rather than
 * inventing a second transport layer.
 */
export function useShoppingOperations() {
  const queryClient = useQueryClient();
  const invalidate = () => { void queryClient.invalidateQueries({ queryKey: shoppingKeys.all }); };
  return {
    health: bind(api.functional.health.get),
    auth: {
      customerJoin: bind(api.functional.shopping.auth.customer.join.customerJoin), customerLogin: bind(api.functional.shopping.auth.customer.login.customerLogin), customerRefresh: bind(api.functional.shopping.auth.customer.refresh.customerRefresh), customerRecoveryRequest: bind(api.functional.shopping.auth.customer.password.recovery.customerRecoveryRequest), customerRecoveryComplete: bind(api.functional.shopping.auth.customer.password.recovery.customerRecoveryComplete),
      sellerJoin: bind(api.functional.shopping.auth.seller.join.sellerJoin), sellerLogin: bind(api.functional.shopping.auth.seller.login.sellerLogin), sellerRefresh: bind(api.functional.shopping.auth.seller.refresh.sellerRefresh), sellerRecoveryRequest: bind(api.functional.shopping.auth.seller.password.recovery.sellerRecoveryRequest), sellerRecoveryComplete: bind(api.functional.shopping.auth.seller.password.recovery.sellerRecoveryComplete),
    },
    customer: {
      accountDelete: useAction(api.functional.shopping.customer.account.customerDelete, invalidate),
      addressIndex: bind(api.functional.shopping.customer.address.addressIndex), addressCreate: useAction(api.functional.shopping.customer.address.addressCreate, invalidate), addressUpdate: useAction(api.functional.shopping.customer.address.addressUpdate, invalidate), addressDelete: useAction(api.functional.shopping.customer.address.addressDelete, invalidate), addressDefault: useAction(api.functional.shopping.customer.address._default.addressDefault, invalidate),
      applicationApply: useAction(api.functional.shopping.customer.administrator_application.customerApply, invalidate), applicationIndex: bind(api.functional.shopping.customer.administrator_application.customerApplications),
      passwordUpdate: useAction(api.functional.shopping.customer.auth.password.customerPasswordUpdate, invalidate), logout: useAction(api.functional.shopping.customer.auth.session.customerLogout, invalidate), logoutAll: useAction(api.functional.shopping.customer.auth.sessions.customerLogoutAll, invalidate),
      cartAdd: useAction(api.functional.shopping.customer.cart.cartAdd, invalidate), cartAt: bind(api.functional.shopping.customer.cart.cartAt), cartUpdate: useAction(api.functional.shopping.customer.cart.cartUpdate, invalidate), cartDelete: useAction(api.functional.shopping.customer.cart.cartDelete, invalidate),
      categoryIndex: bind(api.functional.shopping.customer.category.categoryIndex), categoryProducts: bind(api.functional.shopping.customer.category.product.categoryProducts), checkout: useAction(api.functional.shopping.customer.checkout.checkout, invalidate), payment: useAction(api.functional.shopping.customer.checkout.payment, invalidate),
      orderIndex: bind(api.functional.shopping.customer.order.orderIndex), orderAt: bind(api.functional.shopping.customer.order.orderAt), cancellationCreate: useAction(api.functional.shopping.customer.order.item.cancellation.cancellationCreate, invalidate), refundCreate: useAction(api.functional.shopping.customer.order.item.refund.refundCreate, invalidate), reviewCreate: useAction(api.functional.shopping.customer.order.product.review.reviewCreate, invalidate),
      productIndex: bind(api.functional.shopping.customer.product.productIndex), productAt: bind(api.functional.shopping.customer.product.productAt), profile: bind(api.functional.shopping.customer.profile.customerProfile), profileUpdate: useAction(api.functional.shopping.customer.profile.customerProfileUpdate, invalidate), reviewUpdate: useAction(api.functional.shopping.customer.review.reviewUpdate, invalidate), reviewDelete: useAction(api.functional.shopping.customer.review.reviewDelete, invalidate), sellerPublic: bind(api.functional.shopping.customer.seller.sellerPublic), shipmentDeliver: useAction(api.functional.shopping.customer.shipment.deliver.shipmentDeliver, invalidate), wishlistAdd: useAction(api.functional.shopping.customer.wishlist.wishlistAdd, invalidate), wishlistIndex: bind(api.functional.shopping.customer.wishlist.wishlistIndex), wishlistDelete: useAction(api.functional.shopping.customer.wishlist.wishlistDelete, invalidate),
    },
    seller: {
      accountDelete: useAction(api.functional.shopping.seller.account.sellerDelete, invalidate), applicationApply: useAction(api.functional.shopping.seller.administrator_application.sellerApply, invalidate), applicationIndex: bind(api.functional.shopping.seller.administrator_application.sellerApplications), status: bind(api.functional.shopping.seller.approval.sellerStatus), resubmit: useAction(api.functional.shopping.seller.approval.sellerResubmit, invalidate), passwordUpdate: useAction(api.functional.shopping.seller.auth.password.sellerPasswordUpdate, invalidate), logout: useAction(api.functional.shopping.seller.auth.session.sellerLogout, invalidate), logoutAll: useAction(api.functional.shopping.seller.auth.sessions.sellerLogoutAll, invalidate), cancellationIndex: bind(api.functional.shopping.seller.cancellation.cancellationIndex), cancellationApprove: useAction(api.functional.shopping.seller.cancellation.approve.cancellationApprove, invalidate), cancellationReject: useAction(api.functional.shopping.seller.cancellation.reject.cancellationReject, invalidate), dashboard: bind(api.functional.shopping.seller.dashboard.dashboard), sellerItems: bind(api.functional.shopping.seller.dashboard.order_item.sellerItems), shippingQueue: bind(api.functional.shopping.seller.order.item.shippingQueue), imageUpload: useAction(api.functional.shopping.seller.product.image.imageUpload, invalidate), imageReorder: useAction(api.functional.shopping.seller.product.image.imageReorder, invalidate), imageDelete: useAction(api.functional.shopping.seller.product.image.imageDelete, invalidate), productCreate: useAction(api.functional.shopping.seller.product.productCreate, invalidate), productUpdate: useAction(api.functional.shopping.seller.product.productUpdate, invalidate), productDelete: useAction(api.functional.shopping.seller.product.productDelete, invalidate), productSnapshots: bind(api.functional.shopping.seller.product.snapshot.productSnapshots), variantCreate: useAction(api.functional.shopping.seller.product.variant.variantCreate, invalidate), variantUpdate: useAction(api.functional.shopping.seller.product.variant.variantUpdate, invalidate), variantDelete: useAction(api.functional.shopping.seller.product.variant.variantDelete, invalidate), restock: useAction(api.functional.shopping.seller.product.variant.restock, invalidate), subtract: useAction(api.functional.shopping.seller.product.variant.subtract, invalidate), inventory: bind(api.functional.shopping.seller.product.variant.inventory), profile: bind(api.functional.shopping.seller.profile.sellerOwnProfile), profileUpdate: useAction(api.functional.shopping.seller.profile.sellerProfileUpdate, invalidate), refundIndex: bind(api.functional.shopping.seller.refund.refundIndex), refundApprove: useAction(api.functional.shopping.seller.refund.approve.refundApprove, invalidate), refundReject: useAction(api.functional.shopping.seller.refund.reject.refundReject, invalidate), shipmentCreate: useAction(api.functional.shopping.seller.shipment.shipmentCreate, invalidate),
    },
    admin: {
      promote: useAction(api.functional.shopping.admin.administrator.promote, invalidate), demote: useAction(api.functional.shopping.admin.administrator.demote, invalidate), applicationIndex: bind(api.functional.shopping.admin.administrator_application.pendingApplications), applicationApprove: useAction(api.functional.shopping.admin.administrator_application.approve.applicationApprove, invalidate), applicationReject: useAction(api.functional.shopping.admin.administrator_application.reject.applicationReject, invalidate), categoryCreate: useAction(api.functional.shopping.admin.category.categoryCreate, invalidate), categoryUpdate: useAction(api.functional.shopping.admin.category.categoryUpdate, invalidate), categoryDelete: useAction(api.functional.shopping.admin.category.categoryDelete, invalidate), customerBan: useAction(api.functional.shopping.admin.customer.ban.customerBan, invalidate), customerDirectory: bind(api.functional.shopping.admin.customer.customerDirectory), customerUnban: useAction(api.functional.shopping.admin.customer.unban.customerUnban, invalidate), forceCancelOrder: useAction(api.functional.shopping.admin.order.cancel.forceCancelOrder, invalidate), adminOrderIndex: bind(api.functional.shopping.admin.order.adminOrderIndex), adminOrderAt: bind(api.functional.shopping.admin.order.adminOrderAt), forceCancelItem: useAction(api.functional.shopping.admin.order.item.cancel.forceCancelItem, invalidate), forceRefundItem: useAction(api.functional.shopping.admin.order.item.refund.forceRefundItem, invalidate), forceRefundOrder: useAction(api.functional.shopping.admin.order.refund.forceRefundOrder, invalidate), productPolicyDelete: useAction(api.functional.shopping.admin.product.productPolicyDelete, invalidate), adminProductIndex: bind(api.functional.shopping.admin.product.adminProductIndex), adminProductSnapshots: bind(api.functional.shopping.admin.product.snapshot.adminProductSnapshots), sellerBan: useAction(api.functional.shopping.admin.seller.ban.sellerBan, invalidate), sellerDirectory: bind(api.functional.shopping.admin.seller.sellerDirectory), sellerSuspend: useAction(api.functional.shopping.admin.seller.suspend.sellerSuspend, invalidate), sellerUnban: useAction(api.functional.shopping.admin.seller.unban.sellerUnban, invalidate), sellerUnsuspend: useAction(api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend, invalidate), sellerApprovalIndex: bind(api.functional.shopping.admin.approval.seller.sellerApprovalIndex), sellerApprove: useAction(api.functional.shopping.admin.approval.seller.approve.sellerApprove, invalidate), sellerReject: useAction(api.functional.shopping.admin.approval.seller.reject.sellerReject, invalidate),
    },
  };
}

export function defaultPage(): api.IPage.IRequest { return page(); }
