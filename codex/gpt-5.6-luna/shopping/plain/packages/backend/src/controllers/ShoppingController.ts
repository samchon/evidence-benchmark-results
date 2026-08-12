import { Controller, Headers } from "@nestjs/common";
import * as core from "@nestia/core";
import type * as api from "@benchmark/shopping-api";

import { ShoppingProvider, type ShoppingActor } from "../providers/ShoppingProvider";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Publishes the complete shopping HTTP contract. */
@Controller("shopping")
export class ShoppingController {
  /** @setHeader token.access Authorization @tag Authentication */
  @core.TypedRoute.Post("auth/customer/join") public customerJoin(@core.TypedBody() body: api.IShoppingCustomer.IJoin): Promise<api.IShoppingAuthorized> { return ShoppingProvider.customerJoin(body); }
  /** @setHeader token.access Authorization @tag Authentication */
  @core.TypedRoute.Post("auth/customer/login") public customerLogin(@core.TypedBody() body: api.IShoppingCustomer.ILogin): Promise<api.IShoppingAuthorized> { return ShoppingProvider.customerLogin(body); }
  /** @setHeader token.access Authorization @tag Authentication */
  @core.TypedRoute.Post("auth/customer/refresh") public customerRefresh(@core.TypedBody() body: api.IShoppingCustomer.IRefresh): Promise<api.IShoppingAuthorized> { return ShoppingProvider.refresh("customer", body); }
  /** @setHeader token.access Authorization @tag Authentication */
  @core.TypedRoute.Post("auth/seller/join") public sellerJoin(@core.TypedBody() body: api.IShoppingSeller.IJoin): Promise<api.IShoppingAuthorized> { return ShoppingProvider.sellerJoin(body); }
  /** @setHeader token.access Authorization @tag Authentication */
  @core.TypedRoute.Post("auth/seller/login") public sellerLogin(@core.TypedBody() body: api.IShoppingSeller.ILogin): Promise<api.IShoppingAuthorized> { return ShoppingProvider.sellerLogin(body); }
  /** @setHeader token.access Authorization @tag Authentication */
  @core.TypedRoute.Post("auth/seller/refresh") public sellerRefresh(@core.TypedBody() body: api.IShoppingSeller.IRefresh): Promise<api.IShoppingAuthorized> { return ShoppingProvider.refresh("seller", body); }
  /** Changes the current customer password and revokes other sessions. */
  @core.TypedRoute.Put("customer/auth/password") public async customerPasswordUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingCustomer.IPasswordUpdate): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.updatePassword(await this.auth(authorization, "customer"), body)); }
  /** Starts customer password recovery. */
  @core.TypedRoute.Post("auth/customer/password/recovery") public customerRecoveryRequest(@core.TypedBody() body: api.IShoppingCustomer.IRecoveryRequest): Promise<api.IShoppingRecovery> { return ShoppingProvider.requestRecovery("customer", body); }
  /** Completes customer password recovery. */
  @core.TypedRoute.Put("auth/customer/password/recovery") public async customerRecoveryComplete(@core.TypedBody() body: api.IShoppingCustomer.IRecoveryComplete): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.completeRecovery("customer", body)); }
  /** Changes the current seller password and revokes other sessions. */
  @core.TypedRoute.Put("seller/auth/password") public async sellerPasswordUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingSeller.IPasswordUpdate): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.updatePassword(await this.auth(authorization, "seller"), body)); }
  /** Starts seller password recovery. */
  @core.TypedRoute.Post("auth/seller/password/recovery") public sellerRecoveryRequest(@core.TypedBody() body: api.IShoppingSeller.IRecoveryRequest): Promise<api.IShoppingRecovery> { return ShoppingProvider.requestRecovery("seller", body); }
  /** Completes seller password recovery. */
  @core.TypedRoute.Put("auth/seller/password/recovery") public async sellerRecoveryComplete(@core.TypedBody() body: api.IShoppingSeller.IRecoveryComplete): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.completeRecovery("seller", body)); }

  /** Ends the current customer session. */
  @core.TypedRoute.Delete("customer/auth/session") public async customerLogout(@Headers("authorization") authorization?: string): Promise<api.IShoppingSuccess> { return this.done(this.logoutTask(authorization, "customer")); }
  /** Ends every customer session. */
  @core.TypedRoute.Delete("customer/auth/sessions") public async customerLogoutAll(@Headers("authorization") authorization?: string): Promise<api.IShoppingSuccess> { return this.done(this.logoutAllTask(authorization, "customer")); }
  /** Ends the current seller session. */
  @core.TypedRoute.Delete("seller/auth/session") public async sellerLogout(@Headers("authorization") authorization?: string): Promise<api.IShoppingSuccess> { return this.done(this.logoutTask(authorization, "seller")); }
  /** Ends every seller session. */
  @core.TypedRoute.Delete("seller/auth/sessions") public async sellerLogoutAll(@Headers("authorization") authorization?: string): Promise<api.IShoppingSuccess> { return this.done(this.logoutAllTask(authorization, "seller")); }

  /** Reads the current customer profile. */
  @core.TypedRoute.Get("customer/profile") public async customerProfile(@Headers("authorization") authorization?: string): Promise<api.IShoppingCustomerProfile> { return ShoppingProvider.customerProfile(await this.auth(authorization, "customer")); }
  /** Replaces the current customer profile. */
  @core.TypedRoute.Put("customer/profile") public async customerProfileUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingCustomerProfile.IUpdate): Promise<api.IShoppingCustomerProfile> { return ShoppingProvider.updateCustomerProfile(await this.auth(authorization, "customer"), body); }
  /** Lists the current customer's saved addresses. */
  @core.TypedRoute.Patch("customer/address") public async addressIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingShippingAddress>> { return page(await ShoppingProvider.addresses(await this.auth(authorization, "customer")), body); }
  /** Adds a saved address. */
  @core.TypedRoute.Post("customer/address") public async addressCreate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingShippingAddress.ICreate): Promise<api.IShoppingShippingAddress> { return ShoppingProvider.createAddress(await this.auth(authorization, "customer"), body); }
  /** Replaces one saved address. */
  @core.TypedRoute.Put("customer/address/:id") public async addressUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingShippingAddress.IUpdate): Promise<api.IShoppingShippingAddress> { return ShoppingProvider.updateAddress(await this.auth(authorization, "customer"), id, body); }
  /** Deletes one saved address. */
  @core.TypedRoute.Delete("customer/address/:id") public async addressDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.deleteAddress(await this.auth(authorization, "customer"), id)); }
  /** Makes one saved address default. */
  @core.TypedRoute.Put("customer/address/:id/default") public async addressDefault(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingShippingAddress> { return ShoppingProvider.defaultAddress(await this.auth(authorization, "customer"), id); }

  /** Creates a category. */
  @core.TypedRoute.Post("admin/category") public async categoryCreate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingCategory.ICreate): Promise<api.IShoppingCategory> { return ShoppingProvider.createCategory(await this.adminAuth(authorization), body); }
  /** Lists categories. */
  @core.TypedRoute.Get("customer/category") public async categoryIndex(@Headers("authorization") authorization?: string): Promise<api.IShoppingCategory[]> { return ShoppingProvider.categories(await ShoppingProvider.authenticateBrowse(authorization)); }
  /** Edits a category. */
  @core.TypedRoute.Put("admin/category/:id") public async categoryUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingCategory.IUpdate): Promise<api.IShoppingCategory> { return ShoppingProvider.updateCategory(await this.adminAuth(authorization), id, body); }
  /** Deletes a category. */
  @core.TypedRoute.Delete("admin/category/:id") public async categoryDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.deleteCategory(await this.adminAuth(authorization), id)); }
  /** Lists products directly assigned to a category. */
  @core.TypedRoute.Patch("customer/category/:id/product") public async categoryProducts(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> { return ShoppingProvider.categoryProducts(await ShoppingProvider.authenticateBrowse(authorization), id, body); }

  /** Lists the visible customer catalog. */
  @core.TypedRoute.Patch("customer/product") public async productIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> { return ShoppingProvider.products(await this.auth(authorization, "customer"), body); }
  /** Opens a visible product detail. */
  @core.TypedRoute.Get("customer/product/:id") public async productAt(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingProduct> { return ShoppingProvider.product(await this.auth(authorization, "customer"), id, false); }
  /** Creates a seller product. */
  @core.TypedRoute.Post("seller/product") public async productCreate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingProduct.ICreate): Promise<api.IShoppingProduct> { return ShoppingProvider.createProduct(await this.auth(authorization, "seller"), body); }
  /** Edits a seller product. */
  @core.TypedRoute.Put("seller/product/:id") public async productUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingProduct.IUpdate): Promise<api.IShoppingProduct> { return ShoppingProvider.updateProduct(await this.auth(authorization, "seller"), id, body); }
  /** Deletes a seller product. */
  @core.TypedRoute.Delete("seller/product/:id") public async productDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.deleteProduct(await this.auth(authorization, "seller"), id)); }
  /** Deletes any product for policy violation. */
  @core.TypedRoute.Delete("admin/product/:id") public async productPolicyDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingModeration): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.policyDeleteProduct(await this.adminAuth(authorization), id, body)); }
  /** Lists all live products for administrators. */
  @core.TypedRoute.Patch("admin/product") public async adminProductIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> { return ShoppingProvider.adminProducts(await this.adminAuth(authorization), body); }
  /** Lists immutable snapshots for an owned product. */
  @core.TypedRoute.Patch("seller/product/:id/snapshot") public async productSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingProduct.ISnapshot>> { return ShoppingProvider.productSnapshots(await this.auth(authorization, "seller"), id, body, false); }
  /** Lists immutable snapshots for any product. */
  @core.TypedRoute.Patch("admin/product/:id/snapshot") public async adminProductSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingProduct.ISnapshot>> { return ShoppingProvider.productSnapshots(await this.adminAuth(authorization), id, body, true); }

  /** Uploads images to a product. */
  @core.TypedRoute.Post("seller/product/:productId/image") public async imageUpload(@Headers("authorization") authorization: string | undefined, @core.TypedParam("productId") productId: string, @core.TypedBody() body: api.IShoppingProduct.IImages): Promise<api.IShoppingProduct> { return ShoppingProvider.uploadImages(await this.auth(authorization, "seller"), productId, body); }
  /** Reorders product images. */
  @core.TypedRoute.Put("seller/product/:productId/image") public async imageReorder(@Headers("authorization") authorization: string | undefined, @core.TypedParam("productId") productId: string, @core.TypedBody() body: api.IShoppingProduct.IImageOrder): Promise<api.IShoppingProduct> { return ShoppingProvider.reorderImages(await this.auth(authorization, "seller"), productId, body); }
  /** Deletes one product image. */
  @core.TypedRoute.Delete("seller/product/:productId/image/:id") public async imageDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("productId") productId: string, @core.TypedParam("id") id: string): Promise<api.IShoppingProduct> { return ShoppingProvider.deleteImage(await this.auth(authorization, "seller"), productId, id); }
  /** Adds a variant. */
  @core.TypedRoute.Post("seller/product/:productId/variant") public async variantCreate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("productId") productId: string, @core.TypedBody() body: api.IShoppingVariant.ICreate): Promise<api.IShoppingVariant> { return ShoppingProvider.createVariant(await this.auth(authorization, "seller"), productId, body); }
  /** Edits a variant. */
  @core.TypedRoute.Put("seller/product/variant/:id") public async variantUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingVariant.IUpdate): Promise<api.IShoppingVariant> { return ShoppingProvider.updateVariant(await this.auth(authorization, "seller"), id, body); }
  /** Deletes a variant. */
  @core.TypedRoute.Delete("seller/product/variant/:id") public async variantDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.deleteVariant(await this.auth(authorization, "seller"), id)); }
  /** Restocks a variant. */
  @core.TypedRoute.Post("seller/product/variant/:id/restock") public async restock(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingVariant.IInventory): Promise<api.IShoppingVariant> { return ShoppingProvider.restock(await this.auth(authorization, "seller"), id, body); }
  /** Subtracts seller inventory. */
  @core.TypedRoute.Post("seller/product/variant/:id/subtract") public async subtract(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingVariant.IInventory): Promise<api.IShoppingVariant> { return ShoppingProvider.subtract(await this.auth(authorization, "seller"), id, body); }
  /** Lists variant inventory history. */
  @core.TypedRoute.Patch("seller/product/variant/:id/inventory") public async inventory(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<{ id: string; quantityChange: number; reason: string; createdAt: string }>> { return ShoppingProvider.inventory(await this.auth(authorization, "seller"), id, body); }

  /** Returns the seller approval state. */
  @core.TypedRoute.Get("seller/approval") public async sellerStatus(@Headers("authorization") authorization?: string): Promise<api.IShoppingSeller.IStatus> { return ShoppingProvider.sellerStatus(await this.auth(authorization, "seller")); }
  /** Resubmits a rejected seller approval. */
  @core.TypedRoute.Post("seller/approval") public async sellerResubmit(@Headers("authorization") authorization?: string): Promise<api.IShoppingSeller.IStatus> { return ShoppingProvider.resubmitSeller(await this.auth(authorization, "seller")); }
  /** Lists pending seller approvals. */
  @core.TypedRoute.Patch("admin/approval/seller") public async sellerApprovalIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<{ id: string; sellerId: string; shopName: string; createdAt: string }>> { return ShoppingProvider.sellerApprovals(await this.adminAuth(authorization), body); }
  /** Approves a seller application. */
  @core.TypedRoute.Put("admin/approval/seller/:id/approve") public async sellerApprove(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSeller.IStatus> { return ShoppingProvider.approveSeller(await this.adminAuth(authorization), id); }
  /** Rejects a seller application. */
  @core.TypedRoute.Put("admin/approval/seller/:id/reject") public async sellerReject(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingModeration): Promise<api.IShoppingSeller.IStatus> { return ShoppingProvider.rejectSeller(await this.adminAuth(authorization), id, body); }
  /** Suspends a seller. */
  @core.TypedRoute.Put("admin/seller/:id/suspend") public async sellerSuspend(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.suspendSeller(await this.adminAuth(authorization), id)); }
  /** Unsuspends a seller. */
  @core.TypedRoute.Put("admin/seller/:id/unsuspend") public async sellerUnsuspend(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.unsuspendSeller(await this.adminAuth(authorization), id)); }
  /** Returns a public seller profile. */
  @core.TypedRoute.Get("customer/seller/:id") public async sellerPublic(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSellerProfile & { id: string }> { await this.auth(authorization, "customer"); return ShoppingProvider.sellerProfile(id); }
  /** Returns the seller's own profile. */
  @core.TypedRoute.Get("seller/profile") public async sellerOwnProfile(@Headers("authorization") authorization?: string): Promise<api.IShoppingSellerProfile> { const actor = await this.auth(authorization, "seller"); const value = await ShoppingProvider.sellerProfile(actor.id); return { shopName: value.shopName, shopDescription: value.shopDescription, logo: value.logo }; }
  /** Edits the seller profile. */
  @core.TypedRoute.Put("seller/profile") public async sellerProfileUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingSellerProfile.IUpdate): Promise<api.IShoppingSellerProfile> { return ShoppingProvider.updateSellerProfile(await this.auth(authorization, "seller"), body); }
  /** Lists immutable seller-profile evidence for the owner. */
  @core.TypedRoute.Patch("seller/profile/snapshot") public async sellerProfileSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSnapshot>> { return ShoppingProvider.sellerProfileSnapshots(await this.auth(authorization, "seller"), body, false); }

  /** Adds a product to a customer wishlist. */
  @core.TypedRoute.Post("customer/wishlist/:id") public async wishlistAdd(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingWishlistEntry> { return ShoppingProvider.addWishlist(await this.auth(authorization, "customer"), id); }
  /** Lists a customer wishlist. */
  @core.TypedRoute.Patch("customer/wishlist") public async wishlistIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingWishlistEntry>> { return ShoppingProvider.wishlist(await this.auth(authorization, "customer"), body); }
  /** Removes a product from a customer wishlist. */
  @core.TypedRoute.Delete("customer/wishlist/:id") public async wishlistDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.removeWishlist(await this.auth(authorization, "customer"), id)); }
  /** Adds or merges a cart line. */
  @core.TypedRoute.Post("customer/cart/:id") public async cartAdd(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: { quantity: number }): Promise<api.IShoppingCart> { return ShoppingProvider.addCart(await this.auth(authorization, "customer"), id, body.quantity); }
  /** Reads the current cart. */
  @core.TypedRoute.Get("customer/cart") public async cartAt(@Headers("authorization") authorization?: string): Promise<api.IShoppingCart> { return ShoppingProvider.cart(await this.auth(authorization, "customer")); }
  /** Replaces a cart quantity. */
  @core.TypedRoute.Put("customer/cart/:id") public async cartUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: { quantity: number }): Promise<api.IShoppingCart> { return ShoppingProvider.updateCart(await this.auth(authorization, "customer"), id, body.quantity); }
  /** Removes a cart line. */
  @core.TypedRoute.Delete("customer/cart/:id") public async cartDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.removeCart(await this.auth(authorization, "customer"), id)); }

  /** Starts checkout review. */
  @core.TypedRoute.Post("customer/checkout") public async checkout(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingOrder.ICheckout): Promise<api.IShoppingOrder.ICheckoutSummary> { return ShoppingProvider.checkoutStart(await this.auth(authorization, "customer"), body); }
  /** Confirms one payment attempt or records its failure. */
  @core.TypedRoute.Post("customer/checkout/payment") public async payment(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingOrder.IPayment): Promise<api.IShoppingOrder | { status: "failed" | "unknown" }> { return ShoppingProvider.payment(await this.auth(authorization, "customer"), body); }
  /** Lists customer orders. */
  @core.TypedRoute.Patch("customer/order") public async orderIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingOrder.ISummary>> { return ShoppingProvider.orders(await this.auth(authorization, "customer"), body); }
  /** Opens one customer order. */
  @core.TypedRoute.Get("customer/order/:id") public async orderAt(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingOrder> { return ShoppingProvider.order(await this.auth(authorization, "customer"), id); }
  /** Lists request-decision evidence for one customer's order. */
  @core.TypedRoute.Patch("customer/order/:id/snapshot") public async orderSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSnapshot>> { return ShoppingProvider.orderSnapshots(await this.auth(authorization, "customer"), id, body, "customer"); }
  /** Lists all retained platform orders for administrators. */
  @core.TypedRoute.Patch("admin/order") public async adminOrderIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingOrder.IAdminRequest): Promise<api.IPage<api.IShoppingOrder.IAdminSummary>> { return ShoppingProvider.orders(await this.adminAuth(authorization), body, true); }
  /** Opens any retained platform order for administrators. */
  @core.TypedRoute.Get("admin/order/:id") public async adminOrderAt(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingOrder> { return ShoppingProvider.order(await this.adminAuth(authorization), id, true); }
  /** Lists request-decision evidence for any order. */
  @core.TypedRoute.Patch("admin/order/:id/snapshot") public async adminOrderSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSnapshot>> { return ShoppingProvider.orderSnapshots(await this.adminAuth(authorization), id, body, "admin"); }
  /** Force-cancels one order item. */
  @core.TypedRoute.Put("admin/order/item/:id/cancel") public async forceCancelItem(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingOrder.IForce): Promise<api.IShoppingOrder> { return ShoppingProvider.forceCancelItem(await this.adminAuth(authorization), id, body); }
  /** Force-cancels every eligible item in an order. */
  @core.TypedRoute.Put("admin/order/:id/cancel") public async forceCancelOrder(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingOrder.IForce): Promise<api.IShoppingOrder> { return ShoppingProvider.forceCancelOrder(await this.adminAuth(authorization), id, body); }
  /** Force-refunds one order item. */
  @core.TypedRoute.Put("admin/order/item/:id/refund") public async forceRefundItem(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingOrder.IForce): Promise<api.IShoppingOrder> { return ShoppingProvider.forceRefundItem(await this.adminAuth(authorization), id, body); }
  /** Force-refunds every eligible item in an order. */
  @core.TypedRoute.Put("admin/order/:id/refund") public async forceRefundOrder(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingOrder.IForce): Promise<api.IShoppingOrder> { return ShoppingProvider.forceRefundOrder(await this.adminAuth(authorization), id, body); }
  /** Lists the seller's paid items awaiting shipment. */
  @core.TypedRoute.Patch("seller/order/item") public async shippingQueue(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingOrderItem>> { return ShoppingProvider.shippingQueue(await this.auth(authorization, "seller"), body); }
  /** Lists request-decision evidence for one seller's order. */
  @core.TypedRoute.Patch("seller/order/:id/snapshot") public async sellerOrderSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSnapshot>> { return ShoppingProvider.orderSnapshots(await this.auth(authorization, "seller"), id, body, "seller"); }
  /** Creates a seller shipment. */
  @core.TypedRoute.Post("seller/shipment") public async shipmentCreate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingShipment.ICreate): Promise<api.IShoppingShipment> { return ShoppingProvider.createShipment(await this.auth(authorization, "seller"), body); }
  /** Confirms delivery of one customer shipment. */
  @core.TypedRoute.Put("customer/shipment/:id/deliver") public async shipmentDeliver(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingShipment> { return ShoppingProvider.deliverShipment(await this.auth(authorization, "customer"), id); }

  /** Opens a cancellation request. */
  @core.TypedRoute.Post("customer/order/item/:id/cancellation") public async cancellationCreate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingRequest.ICreate): Promise<api.IShoppingRequest> { return ShoppingProvider.requestCancellation(await this.auth(authorization, "customer"), id, body); }
  /** Lists pending cancellation requests. */
  @core.TypedRoute.Patch("seller/cancellation") public async cancellationIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingRequest>> { return ShoppingProvider.cancellationQueue(await this.auth(authorization, "seller"), body); }
  /** Approves a cancellation request. */
  @core.TypedRoute.Put("seller/cancellation/:id/approve") public async cancellationApprove(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingRequest> { return ShoppingProvider.decideCancellation(await this.auth(authorization, "seller"), id, true); }
  /** Rejects a cancellation request. */
  @core.TypedRoute.Put("seller/cancellation/:id/reject") public async cancellationReject(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingRequest> { return ShoppingProvider.decideCancellation(await this.auth(authorization, "seller"), id, false); }
  /** Opens a refund request. */
  @core.TypedRoute.Post("customer/order/item/:id/refund") public async refundCreate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingRequest.ICreate): Promise<api.IShoppingRequest> { return ShoppingProvider.requestRefund(await this.auth(authorization, "customer"), id, body); }
  /** Lists pending refund requests. */
  @core.TypedRoute.Patch("seller/refund") public async refundIndex(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingRequest>> { return ShoppingProvider.refundQueue(await this.auth(authorization, "seller"), body); }
  /** Approves a refund request. */
  @core.TypedRoute.Put("seller/refund/:id/approve") public async refundApprove(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingRequest> { return ShoppingProvider.decideRefund(await this.auth(authorization, "seller"), id, true); }
  /** Rejects a refund request. */
  @core.TypedRoute.Put("seller/refund/:id/reject") public async refundReject(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingRequest> { return ShoppingProvider.decideRefund(await this.auth(authorization, "seller"), id, false); }

  /** Publishes a product review. */
  @core.TypedRoute.Post("customer/order/:orderId/product/:productId/review") public async reviewCreate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("orderId") orderId: string, @core.TypedParam("productId") productId: string, @core.TypedBody() body: api.IShoppingReview.ICreate): Promise<api.IShoppingReview> { return ShoppingProvider.createReview(await this.auth(authorization, "customer"), productId, orderId, body); }
  /** Edits an authored review. */
  @core.TypedRoute.Put("customer/review/:id") public async reviewUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IShoppingReview.IUpdate): Promise<api.IShoppingReview> { return ShoppingProvider.updateReview(await this.auth(authorization, "customer"), id, body); }
  /** Retires an authored review. */
  @core.TypedRoute.Delete("customer/review/:id") public async reviewDelete(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.deleteReview(await this.auth(authorization, "customer"), id)); }
  /** Lists immutable review evidence for its author. */
  @core.TypedRoute.Patch("customer/review/:id/snapshot") public async reviewSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSnapshot>> { return ShoppingProvider.reviewSnapshots(await this.auth(authorization, "customer"), id, body, false); }
  /** Returns seller dashboard metrics. */
  @core.TypedRoute.Get("seller/dashboard") public async dashboard(@Headers("authorization") authorization?: string): Promise<api.IShoppingDashboard> { return ShoppingProvider.dashboard(await this.auth(authorization, "seller")); }
  /** Lists seller order items. */
  @core.TypedRoute.Patch("seller/dashboard/order-item") public async sellerItems(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest & { status?: api.IShoppingOrderItem["status"] | null }): Promise<api.IPage<api.IShoppingOrderItem>> { return ShoppingProvider.sellerOrderItems(await this.auth(authorization, "seller"), body, body.status ?? undefined); }

  /** Submits an administrator application. */
  @core.TypedRoute.Post("customer/administrator-application") public async customerApply(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingAdministratorApplication.ICreate): Promise<api.IShoppingAdministratorApplication> { return ShoppingProvider.applyAdministrator(await this.auth(authorization, "customer"), body); }
  /** Submits a seller administrator application. */
  @core.TypedRoute.Post("seller/administrator-application") public async sellerApply(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingAdministratorApplication.ICreate): Promise<api.IShoppingAdministratorApplication> { return ShoppingProvider.applyAdministrator(await this.auth(authorization, "seller"), body); }
  /** Lists customer administrator applications. */
  @core.TypedRoute.Patch("customer/administrator-application") public async customerApplications(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingAdministratorApplication>> { return ShoppingProvider.applications(await this.auth(authorization, "customer"), body); }
  /** Lists seller administrator applications. */
  @core.TypedRoute.Patch("seller/administrator-application") public async sellerApplications(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingAdministratorApplication>> { return ShoppingProvider.applications(await this.auth(authorization, "seller"), body); }
  /** Lists pending administrator applications. */
  @core.TypedRoute.Patch("admin/administrator-application") public async pendingApplications(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingAdministratorApplication>> { return ShoppingProvider.pendingApplications(await this.adminAuth(authorization), body); }
  /** Approves an administrator application. */
  @core.TypedRoute.Put("admin/administrator-application/:id/approve") public async applicationApprove(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingAdministratorApplication> { return ShoppingProvider.approveApplication(await this.adminAuth(authorization), id); }
  /** Rejects an administrator application. */
  @core.TypedRoute.Put("admin/administrator-application/:id/reject") public async applicationReject(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingAdministratorApplication> { return ShoppingProvider.rejectApplication(await this.adminAuth(authorization), id); }
  /** Promotes a regular administrator. */
  @core.TypedRoute.Put("admin/administrator/:type/:id/promote") public async promote(@Headers("authorization") authorization: string | undefined, @core.TypedParam("type") type: "customer"|"seller", @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.promote(await this.adminAuth(authorization), id, type)); }
  /** Demotes another super administrator. */
  @core.TypedRoute.Put("admin/administrator/:type/:id/demote") public async demote(@Headers("authorization") authorization: string | undefined, @core.TypedParam("type") type: "customer"|"seller", @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.demote(await this.adminAuth(authorization), id, type)); }
  /** Lists customer accounts for administrators. */
  @core.TypedRoute.Patch("admin/customer") public async customerDirectory(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingCustomer>> { return ShoppingProvider.customerDirectory(await this.adminAuth(authorization), body); }
  /** Lists seller accounts for administrators. */
  @core.TypedRoute.Patch("admin/seller") public async sellerDirectory(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSeller>> { return ShoppingProvider.sellerDirectory(await this.adminAuth(authorization), body); }
  /** Lists immutable seller-profile evidence for any seller. */
  @core.TypedRoute.Patch("admin/seller/:id/snapshot") public async adminSellerProfileSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSnapshot>> { return ShoppingProvider.sellerProfileSnapshots(await this.adminAuth(authorization), body, true, id); }
  /** Bans a customer. */
  @core.TypedRoute.Put("admin/customer/:id/ban") public async customerBan(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.banCustomer(await this.adminAuth(authorization), id)); }
  /** Unbans a customer. */
  @core.TypedRoute.Put("admin/customer/:id/unban") public async customerUnban(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.unbanCustomer(await this.adminAuth(authorization), id)); }
  /** Bans a seller. */
  @core.TypedRoute.Put("admin/seller/:id/ban") public async sellerBan(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.banSeller(await this.adminAuth(authorization), id)); }
  /** Unbans a seller. */
  @core.TypedRoute.Put("admin/seller/:id/unban") public async sellerUnban(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.unbanSeller(await this.adminAuth(authorization), id)); }
  /** Lists immutable review evidence for any review. */
  @core.TypedRoute.Patch("admin/review/:id/snapshot") public async adminReviewSnapshots(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSnapshot>> { return ShoppingProvider.reviewSnapshots(await this.adminAuth(authorization), id, body, true); }
  /** Permanently closes the current customer account. */
  @core.TypedRoute.Delete("customer/account") public async customerDelete(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingCustomer.IDelete): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.deleteCustomer(await this.auth(authorization, "customer"), body)); }
  /** Permanently closes the current seller account. */
  @core.TypedRoute.Delete("seller/account") public async sellerDelete(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: api.IShoppingSeller.IDelete): Promise<api.IShoppingSuccess> { return this.done(ShoppingProvider.deleteSeller(await this.auth(authorization, "seller"), body)); }

  private async auth(authorization: string | undefined, type: ShoppingActor["type"]): Promise<ShoppingActor> { return ShoppingProvider.authenticate(authorization, type); }
  private async adminAuth(authorization: string | undefined): Promise<ShoppingActor> { return ShoppingProvider.authenticateAdmin(authorization); }
  private async logoutTask(authorization: string | undefined, type: ShoppingActor["type"]): Promise<void> { const actor = await ShoppingProvider.authenticateForLogout(authorization, type); if (actor !== null) await ShoppingProvider.logout(actor); }
  private async logoutAllTask(authorization: string | undefined, type: ShoppingActor["type"]): Promise<void> { const actor = await ShoppingProvider.authenticateForLogout(authorization, type); if (actor !== null) await ShoppingProvider.logoutAll(actor); }
  private async done(task: Promise<void>): Promise<api.IShoppingSuccess> { await task; return { success: true }; }
}

function page<T extends object>(values: T[], input: api.IPage.IRequest): api.IPage<T> { const limit = input.limit ?? 100; const current = input.page ?? 1; if (!Number.isInteger(limit) || limit < 0 || !Number.isInteger(current) || current < 1) throw ErrorUtil.unprocessable("Invalid pagination."); const records = values.length; const pages = limit === 0 ? 1 : Math.max(1, Math.ceil(records / limit)); if (current > pages) throw ErrorUtil.unprocessable("The requested page is outside the result set."); return { data: limit === 0 ? values : values.slice((current - 1) * limit, current * limit), pagination: { current, limit, records, pages } }; }
