import * as api from "@benchmark/shopping-api";
import { useState } from "react";

import { apiConnection } from "@/lib/client";

type OperationArgs<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest] ? Rest : never;

/**
 * Shared typed access to every published shopping operation.
 *
 * @evidence {@link api.functional.health.get} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.health.get} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.category.list.categoryIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.category.list.categoryIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.customer.ban.customerBan} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.customer.ban.customerBan} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.customer.customerIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.customer.customerIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.customer.unban.customerUnban} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.customer.unban.customerUnban} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.grade.demote.gradeDemote} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.grade.demote.gradeDemote} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.grade.promote.gradePromote} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.grade.promote.gradePromote} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.order.cancel.forceCancelOrder} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.order.cancel.forceCancelOrder} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.order.detail.orderAt} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.order.detail.orderAt} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.order.list.orderIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.order.list.orderIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.order.refund.forceRefundOrder} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.order.refund.forceRefundOrder} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.order_item.cancel.forceCancelItem} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.order_item.cancel.forceCancelItem} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.order_item.refund.forceRefundItem} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.order_item.refund.forceRefundItem} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.product._delete.productDelete} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.product._delete.productDelete} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.product.list.productIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.product.list.productIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.request.approve.requestApprove} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.request.approve.requestApprove} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.request.create.requestCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.request.create.requestCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.request.list.requestIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.request.list.requestIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.request.pending.requestPending} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.request.pending.requestPending} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.request.reject.requestReject} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.request.reject.requestReject} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.seller.ban.sellerBan} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.seller.ban.sellerBan} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.seller.sellerIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.seller.sellerIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.seller.suspend.sellerSuspend} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.seller.suspend.sellerSuspend} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.seller.unban.sellerUnban} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.seller.unban.sellerUnban} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.customer.join.customerJoin} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.customer.join.customerJoin} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.customer.login.customerLogin} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.customer.login.customerLogin} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.customer.logout.customerLogout} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.customer.logout.customerLogout} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.customer.logout_all.customerLogoutAll} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.customer.logout_all.customerLogoutAll} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.customer.refresh.customerRefresh} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.customer.refresh.customerRefresh} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.seller.join.sellerJoin} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.seller.join.sellerJoin} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.seller.login.sellerLogin} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.seller.login.sellerLogin} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.seller.logout.sellerLogout} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.seller.logout.sellerLogout} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.seller.logout_all.sellerLogoutAll} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.seller.logout_all.sellerLogoutAll} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.seller.recover.complete.sellerRecoverComplete} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.seller.recover.complete.sellerRecoverComplete} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.seller.recover.request.sellerRecover} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.seller.recover.request.sellerRecover} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.auth.seller.refresh.sellerRefresh} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.auth.seller.refresh.sellerRefresh} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.category._delete.categoryErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.category._delete.categoryErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.category.create.categoryCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.category.create.categoryCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.category.detail.categoryAt} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.category.detail.categoryAt} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.category.list.categoryIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.category.list.categoryIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.category.update.categoryUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.category.update.categoryUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.account.erase.accountErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.account.erase.accountErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.address._default.addressDefault} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.address._default.addressDefault} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.address._delete.addressErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.address._delete.addressErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.address.create.addressCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.address.create.addressCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.address.detail.addressAt} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.address.detail.addressAt} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.address.list.addressIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.address.list.addressIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.address.update.addressUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.address.update.addressUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.cancellation.create.cancellationCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.cancellation.create.cancellationCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.cancellation.list.cancellationIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.cancellation.list.cancellationIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.cart._delete.cartErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.cart._delete.cartErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.cart.create.cartCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.cart.create.cartCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.cart.read.cart} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.cart.read.cart} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.cart.update.cartUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.cart.update.cartUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.checkout.execute.checkout} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.checkout.execute.checkout} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.order.detail.orderAt} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.order.detail.orderAt} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.order.list.orderIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.order.list.orderIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.password.update.passwordUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.password.update.passwordUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.profile.read.profile} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.profile.read.profile} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.profile.update.profileUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.profile.update.profileUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.recover.complete.recoverComplete} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.recover.complete.recoverComplete} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.recover.request.recover} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.recover.request.recover} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.refund.create.refundCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.refund.create.refundCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.refund.list.refundIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.refund.list.refundIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.review._delete.reviewErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.review._delete.reviewErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.review.create.reviewCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.review.create.reviewCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.review.update.reviewUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.review.update.reviewUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.wishlist._delete.wishlistErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.wishlist._delete.wishlistErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.wishlist.create.wishlistCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.wishlist.create.wishlistCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.customer.wishlist.list.wishlistIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.customer.wishlist.list.wishlistIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.product.detail.productAt} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.product.detail.productAt} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.product.reviews.productReviews} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.product.reviews.productReviews} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.product.search.productIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.product.search.productIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.product.snapshots.productSnapshots} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.product.snapshots.productSnapshots} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.account.erase.accountErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.account.erase.accountErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.approval.approve.approvalApprove} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.approval.approve.approvalApprove} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.approval.pending.approvalIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.approval.pending.approvalIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.approval.reject.approvalReject} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.approval.reject.approvalReject} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.approval.status.approval} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.approval.status.approval} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.approval.submit.approvalCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.approval.submit.approvalCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.cancellation.decide.cancellationDecide} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.cancellation.decide.cancellationDecide} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.cancellation.list.cancellationIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.cancellation.list.cancellationIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.dashboard.order_item.dashboardItems} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.dashboard.order_item.dashboardItems} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.dashboard.summary.dashboard} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.dashboard.summary.dashboard} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.password.update.passwordUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.password.update.passwordUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product._delete.productErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product._delete.productErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product.create.productCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product.create.productCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product.image._delete.imageErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product.image._delete.imageErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product.image.create.imageCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product.image.create.imageCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product.image.reorder.imageReorder} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product.image.reorder.imageReorder} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product.update.productUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product.update.productUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product.variant._delete.variantErase} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product.variant._delete.variantErase} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product.variant.create.variantCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product.variant.create.variantCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.product.variant.update.variantUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.product.variant.update.variantUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.profile._public.profileAt} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.profile._public.profileAt} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.profile.read.profile} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.profile.read.profile} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.profile.update.profileUpdate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.profile.update.profileUpdate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.refund.decide.refundDecide} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.refund.decide.refundDecide} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.refund.list.refundIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.refund.list.refundIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.shipment.create.shipmentCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.shipment.create.shipmentCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.shipment.deliver.shipmentDeliver} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.shipment.deliver.shipmentDeliver} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.shipment.detail.shipmentAt} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.shipment.detail.shipmentAt} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.shipment.items.shipmentItems} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.shipment.items.shipmentItems} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.variant.inventory.create.inventoryCreate} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.variant.inventory.create.inventoryCreate} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 * @evidence {@link api.functional.shopping.seller.variant.inventory.list.inventoryIndex} Calls the generated accessor from the shared frontend connection.
 * @evidenceReview {@link api.functional.shopping.seller.variant.inventory.list.inventoryIndex} Read this wrapper and the generated SDK declaration; confirmed it invokes the cited accessor through apiConnection.
 */
export function useShoppingOperations() {
  const [operations] = useState(() => ({
  /** Calls api.functional.health.get. */
  Get: (...args: OperationArgs<Parameters<typeof api.functional.health.get>>) => api.functional.health.get(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.category.list.categoryIndex. */
  AdminCategoryListCategoryIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.category.list.categoryIndex>>) => api.functional.shopping.admin.category.list.categoryIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.customer.ban.customerBan. */
  AdminCustomerBanCustomerBan: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.customer.ban.customerBan>>) => api.functional.shopping.admin.customer.ban.customerBan(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.customer.customerIndex. */
  AdminCustomerCustomerIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.customer.customerIndex>>) => api.functional.shopping.admin.customer.customerIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.customer.unban.customerUnban. */
  AdminCustomerUnbanCustomerUnban: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.customer.unban.customerUnban>>) => api.functional.shopping.admin.customer.unban.customerUnban(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.grade.demote.gradeDemote. */
  AdminGradeDemoteGradeDemote: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.grade.demote.gradeDemote>>) => api.functional.shopping.admin.grade.demote.gradeDemote(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.grade.promote.gradePromote. */
  AdminGradePromoteGradePromote: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.grade.promote.gradePromote>>) => api.functional.shopping.admin.grade.promote.gradePromote(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.order.cancel.forceCancelOrder. */
  AdminOrderCancelForceCancelOrder: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.order.cancel.forceCancelOrder>>) => api.functional.shopping.admin.order.cancel.forceCancelOrder(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.order.detail.orderAt. */
  AdminOrderDetailOrderAt: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.order.detail.orderAt>>) => api.functional.shopping.admin.order.detail.orderAt(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.order.list.orderIndex. */
  AdminOrderListOrderIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.order.list.orderIndex>>) => api.functional.shopping.admin.order.list.orderIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.order.refund.forceRefundOrder. */
  AdminOrderRefundForceRefundOrder: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.order.refund.forceRefundOrder>>) => api.functional.shopping.admin.order.refund.forceRefundOrder(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.order_item.cancel.forceCancelItem. */
  AdminOrderItemCancelForceCancelItem: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.order_item.cancel.forceCancelItem>>) => api.functional.shopping.admin.order_item.cancel.forceCancelItem(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.order_item.refund.forceRefundItem. */
  AdminOrderItemRefundForceRefundItem: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.order_item.refund.forceRefundItem>>) => api.functional.shopping.admin.order_item.refund.forceRefundItem(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.product._delete.productDelete. */
  AdminProductDeleteProductDelete: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.product._delete.productDelete>>) => api.functional.shopping.admin.product._delete.productDelete(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.product.list.productIndex. */
  AdminProductListProductIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.product.list.productIndex>>) => api.functional.shopping.admin.product.list.productIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.request.approve.requestApprove. */
  AdminRequestApproveRequestApprove: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.request.approve.requestApprove>>) => api.functional.shopping.admin.request.approve.requestApprove(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.request.create.requestCreate. */
  AdminRequestCreateRequestCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.request.create.requestCreate>>) => api.functional.shopping.admin.request.create.requestCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.request.list.requestIndex. */
  AdminRequestListRequestIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.request.list.requestIndex>>) => api.functional.shopping.admin.request.list.requestIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.request.pending.requestPending. */
  AdminRequestPendingRequestPending: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.request.pending.requestPending>>) => api.functional.shopping.admin.request.pending.requestPending(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.request.reject.requestReject. */
  AdminRequestRejectRequestReject: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.request.reject.requestReject>>) => api.functional.shopping.admin.request.reject.requestReject(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.seller.ban.sellerBan. */
  AdminSellerBanSellerBan: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.seller.ban.sellerBan>>) => api.functional.shopping.admin.seller.ban.sellerBan(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.seller.sellerIndex. */
  AdminSellerSellerIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.seller.sellerIndex>>) => api.functional.shopping.admin.seller.sellerIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.seller.suspend.sellerSuspend. */
  AdminSellerSuspendSellerSuspend: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.seller.suspend.sellerSuspend>>) => api.functional.shopping.admin.seller.suspend.sellerSuspend(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.seller.unban.sellerUnban. */
  AdminSellerUnbanSellerUnban: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.seller.unban.sellerUnban>>) => api.functional.shopping.admin.seller.unban.sellerUnban(apiConnection, ...args),
  /** Calls api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend. */
  AdminSellerUnsuspendSellerUnsuspend: (...args: OperationArgs<Parameters<typeof api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend>>) => api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.customer.join.customerJoin. */
  AuthCustomerJoinCustomerJoin: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.customer.join.customerJoin>>) => api.functional.shopping.auth.customer.join.customerJoin(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.customer.login.customerLogin. */
  AuthCustomerLoginCustomerLogin: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.customer.login.customerLogin>>) => api.functional.shopping.auth.customer.login.customerLogin(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.customer.logout.customerLogout. */
  AuthCustomerLogoutCustomerLogout: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.customer.logout.customerLogout>>) => api.functional.shopping.auth.customer.logout.customerLogout(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.customer.logout_all.customerLogoutAll. */
  AuthCustomerLogoutAllCustomerLogoutAll: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.customer.logout_all.customerLogoutAll>>) => api.functional.shopping.auth.customer.logout_all.customerLogoutAll(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.customer.refresh.customerRefresh. */
  AuthCustomerRefreshCustomerRefresh: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.customer.refresh.customerRefresh>>) => api.functional.shopping.auth.customer.refresh.customerRefresh(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.seller.join.sellerJoin. */
  AuthSellerJoinSellerJoin: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.seller.join.sellerJoin>>) => api.functional.shopping.auth.seller.join.sellerJoin(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.seller.login.sellerLogin. */
  AuthSellerLoginSellerLogin: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.seller.login.sellerLogin>>) => api.functional.shopping.auth.seller.login.sellerLogin(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.seller.logout.sellerLogout. */
  AuthSellerLogoutSellerLogout: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.seller.logout.sellerLogout>>) => api.functional.shopping.auth.seller.logout.sellerLogout(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.seller.logout_all.sellerLogoutAll. */
  AuthSellerLogoutAllSellerLogoutAll: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.seller.logout_all.sellerLogoutAll>>) => api.functional.shopping.auth.seller.logout_all.sellerLogoutAll(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.seller.recover.complete.sellerRecoverComplete. */
  AuthSellerRecoverCompleteSellerRecoverComplete: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.seller.recover.complete.sellerRecoverComplete>>) => api.functional.shopping.auth.seller.recover.complete.sellerRecoverComplete(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.seller.recover.request.sellerRecover. */
  AuthSellerRecoverRequestSellerRecover: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.seller.recover.request.sellerRecover>>) => api.functional.shopping.auth.seller.recover.request.sellerRecover(apiConnection, ...args),
  /** Calls api.functional.shopping.auth.seller.refresh.sellerRefresh. */
  AuthSellerRefreshSellerRefresh: (...args: OperationArgs<Parameters<typeof api.functional.shopping.auth.seller.refresh.sellerRefresh>>) => api.functional.shopping.auth.seller.refresh.sellerRefresh(apiConnection, ...args),
  /** Calls api.functional.shopping.category._delete.categoryErase. */
  CategoryDeleteCategoryErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.category._delete.categoryErase>>) => api.functional.shopping.category._delete.categoryErase(apiConnection, ...args),
  /** Calls api.functional.shopping.category.create.categoryCreate. */
  CategoryCreateCategoryCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.category.create.categoryCreate>>) => api.functional.shopping.category.create.categoryCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.category.detail.categoryAt. */
  CategoryDetailCategoryAt: (...args: OperationArgs<Parameters<typeof api.functional.shopping.category.detail.categoryAt>>) => api.functional.shopping.category.detail.categoryAt(apiConnection, ...args),
  /** Calls api.functional.shopping.category.list.categoryIndex. */
  CategoryListCategoryIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.category.list.categoryIndex>>) => api.functional.shopping.category.list.categoryIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.category.update.categoryUpdate. */
  CategoryUpdateCategoryUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.category.update.categoryUpdate>>) => api.functional.shopping.category.update.categoryUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.account.erase.accountErase. */
  CustomerAccountEraseAccountErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.account.erase.accountErase>>) => api.functional.shopping.customer.account.erase.accountErase(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.address._default.addressDefault. */
  CustomerAddressDefaultAddressDefault: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.address._default.addressDefault>>) => api.functional.shopping.customer.address._default.addressDefault(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.address._delete.addressErase. */
  CustomerAddressDeleteAddressErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.address._delete.addressErase>>) => api.functional.shopping.customer.address._delete.addressErase(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.address.create.addressCreate. */
  CustomerAddressCreateAddressCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.address.create.addressCreate>>) => api.functional.shopping.customer.address.create.addressCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.address.detail.addressAt. */
  CustomerAddressDetailAddressAt: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.address.detail.addressAt>>) => api.functional.shopping.customer.address.detail.addressAt(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.address.list.addressIndex. */
  CustomerAddressListAddressIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.address.list.addressIndex>>) => api.functional.shopping.customer.address.list.addressIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.address.update.addressUpdate. */
  CustomerAddressUpdateAddressUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.address.update.addressUpdate>>) => api.functional.shopping.customer.address.update.addressUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.cancellation.create.cancellationCreate. */
  CustomerCancellationCreateCancellationCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.cancellation.create.cancellationCreate>>) => api.functional.shopping.customer.cancellation.create.cancellationCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.cancellation.list.cancellationIndex. */
  CustomerCancellationListCancellationIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.cancellation.list.cancellationIndex>>) => api.functional.shopping.customer.cancellation.list.cancellationIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.cart._delete.cartErase. */
  CustomerCartDeleteCartErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.cart._delete.cartErase>>) => api.functional.shopping.customer.cart._delete.cartErase(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.cart.create.cartCreate. */
  CustomerCartCreateCartCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.cart.create.cartCreate>>) => api.functional.shopping.customer.cart.create.cartCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.cart.read.cart. */
  CustomerCartReadCart: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.cart.read.cart>>) => api.functional.shopping.customer.cart.read.cart(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.cart.update.cartUpdate. */
  CustomerCartUpdateCartUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.cart.update.cartUpdate>>) => api.functional.shopping.customer.cart.update.cartUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.checkout.execute.checkout. */
  CustomerCheckoutExecuteCheckout: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.checkout.execute.checkout>>) => api.functional.shopping.customer.checkout.execute.checkout(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.order.detail.orderAt. */
  CustomerOrderDetailOrderAt: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.order.detail.orderAt>>) => api.functional.shopping.customer.order.detail.orderAt(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.order.list.orderIndex. */
  CustomerOrderListOrderIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.order.list.orderIndex>>) => api.functional.shopping.customer.order.list.orderIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.password.update.passwordUpdate. */
  CustomerPasswordUpdatePasswordUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.password.update.passwordUpdate>>) => api.functional.shopping.customer.password.update.passwordUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.profile.read.profile. */
  CustomerProfileReadProfile: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.profile.read.profile>>) => api.functional.shopping.customer.profile.read.profile(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.profile.update.profileUpdate. */
  CustomerProfileUpdateProfileUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.profile.update.profileUpdate>>) => api.functional.shopping.customer.profile.update.profileUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.recover.complete.recoverComplete. */
  CustomerRecoverCompleteRecoverComplete: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.recover.complete.recoverComplete>>) => api.functional.shopping.customer.recover.complete.recoverComplete(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.recover.request.recover. */
  CustomerRecoverRequestRecover: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.recover.request.recover>>) => api.functional.shopping.customer.recover.request.recover(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.refund.create.refundCreate. */
  CustomerRefundCreateRefundCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.refund.create.refundCreate>>) => api.functional.shopping.customer.refund.create.refundCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.refund.list.refundIndex. */
  CustomerRefundListRefundIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.refund.list.refundIndex>>) => api.functional.shopping.customer.refund.list.refundIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.review._delete.reviewErase. */
  CustomerReviewDeleteReviewErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.review._delete.reviewErase>>) => api.functional.shopping.customer.review._delete.reviewErase(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.review.create.reviewCreate. */
  CustomerReviewCreateReviewCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.review.create.reviewCreate>>) => api.functional.shopping.customer.review.create.reviewCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.review.update.reviewUpdate. */
  CustomerReviewUpdateReviewUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.review.update.reviewUpdate>>) => api.functional.shopping.customer.review.update.reviewUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.wishlist._delete.wishlistErase. */
  CustomerWishlistDeleteWishlistErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.wishlist._delete.wishlistErase>>) => api.functional.shopping.customer.wishlist._delete.wishlistErase(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.wishlist.create.wishlistCreate. */
  CustomerWishlistCreateWishlistCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.wishlist.create.wishlistCreate>>) => api.functional.shopping.customer.wishlist.create.wishlistCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.customer.wishlist.list.wishlistIndex. */
  CustomerWishlistListWishlistIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.customer.wishlist.list.wishlistIndex>>) => api.functional.shopping.customer.wishlist.list.wishlistIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.product.detail.productAt. */
  ProductDetailProductAt: (...args: OperationArgs<Parameters<typeof api.functional.shopping.product.detail.productAt>>) => api.functional.shopping.product.detail.productAt(apiConnection, ...args),
  /** Calls api.functional.shopping.product.reviews.productReviews. */
  ProductReviewsProductReviews: (...args: OperationArgs<Parameters<typeof api.functional.shopping.product.reviews.productReviews>>) => api.functional.shopping.product.reviews.productReviews(apiConnection, ...args),
  /** Calls api.functional.shopping.product.search.productIndex. */
  ProductSearchProductIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.product.search.productIndex>>) => api.functional.shopping.product.search.productIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.product.snapshots.productSnapshots. */
  ProductSnapshotsProductSnapshots: (...args: OperationArgs<Parameters<typeof api.functional.shopping.product.snapshots.productSnapshots>>) => api.functional.shopping.product.snapshots.productSnapshots(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.account.erase.accountErase. */
  SellerAccountEraseAccountErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.account.erase.accountErase>>) => api.functional.shopping.seller.account.erase.accountErase(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.approval.approve.approvalApprove. */
  SellerApprovalApproveApprovalApprove: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.approval.approve.approvalApprove>>) => api.functional.shopping.seller.approval.approve.approvalApprove(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.approval.pending.approvalIndex. */
  SellerApprovalPendingApprovalIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.approval.pending.approvalIndex>>) => api.functional.shopping.seller.approval.pending.approvalIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.approval.reject.approvalReject. */
  SellerApprovalRejectApprovalReject: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.approval.reject.approvalReject>>) => api.functional.shopping.seller.approval.reject.approvalReject(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.approval.status.approval. */
  SellerApprovalStatusApproval: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.approval.status.approval>>) => api.functional.shopping.seller.approval.status.approval(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.approval.submit.approvalCreate. */
  SellerApprovalSubmitApprovalCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.approval.submit.approvalCreate>>) => api.functional.shopping.seller.approval.submit.approvalCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.cancellation.decide.cancellationDecide. */
  SellerCancellationDecideCancellationDecide: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.cancellation.decide.cancellationDecide>>) => api.functional.shopping.seller.cancellation.decide.cancellationDecide(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.cancellation.list.cancellationIndex. */
  SellerCancellationListCancellationIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.cancellation.list.cancellationIndex>>) => api.functional.shopping.seller.cancellation.list.cancellationIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.dashboard.order_item.dashboardItems. */
  SellerDashboardOrderItemDashboardItems: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.dashboard.order_item.dashboardItems>>) => api.functional.shopping.seller.dashboard.order_item.dashboardItems(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.dashboard.summary.dashboard. */
  SellerDashboardSummaryDashboard: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.dashboard.summary.dashboard>>) => api.functional.shopping.seller.dashboard.summary.dashboard(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.password.update.passwordUpdate. */
  SellerPasswordUpdatePasswordUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.password.update.passwordUpdate>>) => api.functional.shopping.seller.password.update.passwordUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product._delete.productErase. */
  SellerProductDeleteProductErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product._delete.productErase>>) => api.functional.shopping.seller.product._delete.productErase(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product.create.productCreate. */
  SellerProductCreateProductCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product.create.productCreate>>) => api.functional.shopping.seller.product.create.productCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product.image._delete.imageErase. */
  SellerProductImageDeleteImageErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product.image._delete.imageErase>>) => api.functional.shopping.seller.product.image._delete.imageErase(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product.image.create.imageCreate. */
  SellerProductImageCreateImageCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product.image.create.imageCreate>>) => api.functional.shopping.seller.product.image.create.imageCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product.image.reorder.imageReorder. */
  SellerProductImageReorderImageReorder: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product.image.reorder.imageReorder>>) => api.functional.shopping.seller.product.image.reorder.imageReorder(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product.update.productUpdate. */
  SellerProductUpdateProductUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product.update.productUpdate>>) => api.functional.shopping.seller.product.update.productUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product.variant._delete.variantErase. */
  SellerProductVariantDeleteVariantErase: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product.variant._delete.variantErase>>) => api.functional.shopping.seller.product.variant._delete.variantErase(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product.variant.create.variantCreate. */
  SellerProductVariantCreateVariantCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product.variant.create.variantCreate>>) => api.functional.shopping.seller.product.variant.create.variantCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.product.variant.update.variantUpdate. */
  SellerProductVariantUpdateVariantUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.product.variant.update.variantUpdate>>) => api.functional.shopping.seller.product.variant.update.variantUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.profile._public.profileAt. */
  SellerProfilePublicProfileAt: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.profile._public.profileAt>>) => api.functional.shopping.seller.profile._public.profileAt(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.profile.read.profile. */
  SellerProfileReadProfile: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.profile.read.profile>>) => api.functional.shopping.seller.profile.read.profile(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.profile.update.profileUpdate. */
  SellerProfileUpdateProfileUpdate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.profile.update.profileUpdate>>) => api.functional.shopping.seller.profile.update.profileUpdate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.refund.decide.refundDecide. */
  SellerRefundDecideRefundDecide: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.refund.decide.refundDecide>>) => api.functional.shopping.seller.refund.decide.refundDecide(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.refund.list.refundIndex. */
  SellerRefundListRefundIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.refund.list.refundIndex>>) => api.functional.shopping.seller.refund.list.refundIndex(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.shipment.create.shipmentCreate. */
  SellerShipmentCreateShipmentCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.shipment.create.shipmentCreate>>) => api.functional.shopping.seller.shipment.create.shipmentCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.shipment.deliver.shipmentDeliver. */
  SellerShipmentDeliverShipmentDeliver: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.shipment.deliver.shipmentDeliver>>) => api.functional.shopping.seller.shipment.deliver.shipmentDeliver(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.shipment.detail.shipmentAt. */
  SellerShipmentDetailShipmentAt: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.shipment.detail.shipmentAt>>) => api.functional.shopping.seller.shipment.detail.shipmentAt(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.shipment.items.shipmentItems. */
  SellerShipmentItemsShipmentItems: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.shipment.items.shipmentItems>>) => api.functional.shopping.seller.shipment.items.shipmentItems(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.variant.inventory.create.inventoryCreate. */
  SellerVariantInventoryCreateInventoryCreate: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.variant.inventory.create.inventoryCreate>>) => api.functional.shopping.seller.variant.inventory.create.inventoryCreate(apiConnection, ...args),
  /** Calls api.functional.shopping.seller.variant.inventory.list.inventoryIndex. */
  SellerVariantInventoryListInventoryIndex: (...args: OperationArgs<Parameters<typeof api.functional.shopping.seller.variant.inventory.list.inventoryIndex>>) => api.functional.shopping.seller.variant.inventory.list.inventoryIndex(apiConnection, ...args),
  } as const));
  return operations;
}
