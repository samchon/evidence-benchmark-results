import * as core from "@nestia/core";
import type {
  IEntity,
  IPage,
  IShoppingAddress,
  IShoppingAdmin,
  IShoppingAdminApplication,
  IShoppingAuth,
  IShoppingCart,
  IShoppingCheckout,
  IShoppingCategory,
  IShoppingCustomerProfile,
  IShoppingInventory,
  IShoppingOrder,
  IShoppingProduct,
  IShoppingRequest,
  IShoppingReview,
  IShoppingSellerApproval,
  IShoppingSellerProfile,
  IShoppingShipment,
  IShoppingWishlist,

} from "@benchmark/shopping-api";
import { Controller } from "@nestjs/common";
import type { tags } from "typia";
import { ShoppingProvider } from "../providers/ShoppingProvider";


/** Publishes the requirement-derived shopping API. */
@Controller("shopping")
export class ShoppingController {
  @core.TypedRoute.Post("auth/customer/join") public customerJoin(@core.TypedBody() body: IShoppingAuth.IJoin): Promise<IShoppingAuth.IAuthorized> {
    return ShoppingProvider.join("customer", body);
  }
  @core.TypedRoute.Post("auth/customer/login") public customerLogin(@core.TypedBody() body: IShoppingAuth.ILogin): Promise<IShoppingAuth.IAuthorized> {
    return ShoppingProvider.login("customer", body);
  }
  @core.TypedRoute.Post("auth/customer/refresh") public customerRefresh(@core.TypedBody() body: IShoppingAuth.IRefresh): Promise<IShoppingAuth.IAuthorized> {
    return ShoppingProvider.refresh("customer", body);
  }
  @core.TypedRoute.Post("auth/customer/recovery") public customerRecoveryRequest(@core.TypedBody() body: IShoppingAuth.IRecoveryRequest): Promise<IShoppingAuth.IRecoveryChallenge> {
    return ShoppingProvider.recoveryRequest("customer", body);
  }
  @core.TypedRoute.Put("auth/customer/recovery") public customerRecoveryComplete(@core.TypedBody() body: IShoppingAuth.IRecoveryComplete): Promise<IEntity> {
    return ShoppingProvider.recoveryComplete("customer", body);
  }
  @core.TypedRoute.Post("auth/seller/join") public sellerJoin(@core.TypedBody() body: IShoppingAuth.IJoin): Promise<IShoppingAuth.IAuthorized> {
    return ShoppingProvider.join("seller", body);
  }
  @core.TypedRoute.Post("auth/seller/login") public sellerLogin(@core.TypedBody() body: IShoppingAuth.ILogin): Promise<IShoppingAuth.IAuthorized> {
    return ShoppingProvider.login("seller", body);
  }
  @core.TypedRoute.Post("auth/seller/refresh") public sellerRefresh(@core.TypedBody() body: IShoppingAuth.IRefresh): Promise<IShoppingAuth.IAuthorized> {
    return ShoppingProvider.refresh("seller", body);
  }
  @core.TypedRoute.Post("auth/seller/recovery") public sellerRecoveryRequest(@core.TypedBody() body: IShoppingAuth.IRecoveryRequest): Promise<IShoppingAuth.IRecoveryChallenge> {
    return ShoppingProvider.recoveryRequest("seller", body);
  }
  @core.TypedRoute.Put("auth/seller/recovery") public sellerRecoveryComplete(@core.TypedBody() body: IShoppingAuth.IRecoveryComplete): Promise<IEntity> {
    return ShoppingProvider.recoveryComplete("seller", body);
  }

  @core.TypedRoute.Post("customer/logout") public customerLogout(@core.TypedHeaders() headers: { authorization?: string }): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then(
      ShoppingProvider.logout,
    );
  }
  @core.TypedRoute.Post("customer/logout-all") public customerLogoutAll(@core.TypedHeaders() headers: { authorization?: string }): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then(
      ShoppingProvider.logoutAll,
    );
  }
  @core.TypedRoute.Post("seller/logout") public sellerLogout(@core.TypedHeaders() headers: { authorization?: string }): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "seller").then(
      ShoppingProvider.logout,
    );
  }
  @core.TypedRoute.Post("seller/logout-all") public sellerLogoutAll(@core.TypedHeaders() headers: { authorization?: string }): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "seller").then(
      ShoppingProvider.logoutAll,
    );
  }
  @core.TypedRoute.Put("customer/password") public customerPassword(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingAuth.IPasswordChange): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) => ShoppingProvider.changePassword(p, body));
  }
  @core.TypedRoute.Delete("customer/account") public customerAccountDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingAuth.IAccountDelete): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) => ShoppingProvider.deleteAccount(p, body));
  }
  @core.TypedRoute.Get("customer/profile") public customerProfile(@core.TypedHeaders() headers: { authorization?: string }): Promise<IShoppingCustomerProfile.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then(
      ShoppingProvider.customerProfile,
    );
  }
  @core.TypedRoute.Patch("customer/profile") public customerProfileUpdate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingCustomerProfile.IUpdate): Promise<IShoppingCustomerProfile.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.updateCustomerProfile(p, body),
    );
  }
  @core.TypedRoute.Patch("customer/address") public customerAddresses(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingAddress.IDetail>> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.addresses(p, input),
    );
  }
  @core.TypedRoute.Post("customer/address") public customerAddressCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingAddress.ICreate): Promise<IShoppingAddress.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.addressCreate(p, body),
    );
  }
  @core.TypedRoute.Put("customer/address/:id") public customerAddressUpdate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingAddress.IUpdate): Promise<IShoppingAddress.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.addressUpdate(p, id, body),
    );
  }
  @core.TypedRoute.Delete("customer/address/:id") public customerAddressDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.addressDelete(p, id),
    );
  }
  @core.TypedRoute.Put("customer/address/:id/default") public customerAddressDefault(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IShoppingAddress.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.addressDefault(p, id),
    );
  }

  @core.TypedRoute.Get("seller/profile") public sellerProfile(@core.TypedHeaders() headers: { authorization?: string }): Promise<IShoppingSellerProfile.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then(
      ShoppingProvider.sellerProfile,
    );
  }
  @core.TypedRoute.Put("seller/password") public sellerPassword(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingAuth.IPasswordChange): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) => ShoppingProvider.changePassword(p, body));
  }
  @core.TypedRoute.Delete("seller/account") public sellerAccountDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingAuth.IAccountDelete): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) => ShoppingProvider.deleteAccount(p, body));
  }
  @core.TypedRoute.Patch("seller/profile") public sellerProfileUpdate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingSellerProfile.IUpdate): Promise<IShoppingSellerProfile.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.updateSellerProfile(p, body),
    );
  }
  @core.TypedRoute.Patch("seller/profile/snapshot") public sellerProfileSnapshots(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingSellerProfile.ISnapshot>> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) => ShoppingProvider.sellerProfileSnapshots(p, input));
  }
  @core.TypedRoute.Patch("admin/seller/:id/snapshot") public adminSellerProfileSnapshots(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingSellerProfile.ISnapshot>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.sellerProfileSnapshots(p, input, id));
  }
  @core.TypedRoute.Get("seller/profile/:id") public sellerProfilePublic(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IShoppingSellerProfile.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.publicSeller(p, id),
    );
  }
  @core.TypedRoute.Get("seller/approval") public sellerApproval(@core.TypedHeaders() headers: { authorization?: string }): Promise<IShoppingSellerApproval.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then(
      ShoppingProvider.sellerApproval,
    );
  }
  @core.TypedRoute.Post("seller/approval/resubmit") public sellerApprovalResubmit(@core.TypedHeaders() headers: { authorization?: string }): Promise<IShoppingSellerApproval.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then(
      ShoppingProvider.sellerResubmit,
    );
  }
  @core.TypedRoute.Patch("admin/seller/approval") public sellerApprovals(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingSellerApproval.IDetail>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.sellerApprovals(p, input));
  }
  @core.TypedRoute.Put("admin/seller/approval/approve/:id") public sellerApprove(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingSellerApproval.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.sellerDecision(p, id, true));
  }
  @core.TypedRoute.Put("admin/seller/approval/reject/:id") public sellerReject(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingSellerApproval.IDecision): Promise<IShoppingSellerApproval.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.sellerDecision(p, id, false, body.reason ?? undefined));
  }
  @core.TypedRoute.Put("admin/seller/suspend/:id") public sellerSuspend(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingSellerProfile.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.sellerSuspend(p, id, true));
  }
  @core.TypedRoute.Put("admin/seller/unsuspend/:id") public sellerUnsuspend(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingSellerProfile.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.sellerSuspend(p, id, false));
  }

  @core.TypedRoute.Post("admin/category") public categoryCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingCategory.ICreate): Promise<IShoppingCategory.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) =>
      ShoppingProvider.categoryCreate(p, body),
    );
  }
  @core.TypedRoute.Put("admin/category/:id") public categoryUpdate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingCategory.IUpdate): Promise<IShoppingCategory.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) =>
      ShoppingProvider.categoryUpdate(p, id, body),
    );
  }
  @core.TypedRoute.Delete("admin/category/:id") public categoryDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IEntity> {
    return ShoppingProvider.authenticateAny(headers).then((p) =>
      ShoppingProvider.categoryDelete(p, id),
    );
  }
  @core.TypedRoute.Get("customer/category") public categories(@core.TypedHeaders() headers: { authorization?: string }): Promise<IShoppingCategory.IDetail[]> {
    return ShoppingProvider.authenticate(headers, "customer").then(
      ShoppingProvider.categories,
    );
  }
  @core.TypedRoute.Patch("customer/category/:id/product") public categoryProducts(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) => ShoppingProvider.categoryProducts(p, id, input));
  }

  @core.TypedRoute.Post("seller/product") public productCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingProduct.ICreate): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.productCreate(p, body),
    );
  }
  @core.TypedRoute.Put("seller/product/:id") public productUpdate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingProduct.IUpdate): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.productUpdate(p, id, body),
    );
  }
  @core.TypedRoute.Delete("seller/product/:id") public productDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.productDelete(p, id),
    );
  }
  @core.TypedRoute.Post("seller/product/:id/image") public imageUpload(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingProduct.IImageCreate): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) => ShoppingProvider.imageUpload(p, id, body));
  }
  @core.TypedRoute.Put("seller/product/:id/image") public imageReorder(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingProduct.IImageReorder): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) => ShoppingProvider.imageReorder(p, id, body));
  }
  @core.TypedRoute.Delete("seller/product/image/:id") public imageDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) => ShoppingProvider.imageDelete(p, "", id));
  }
  @core.TypedRoute.Patch("customer/product") public products(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.products(p, input),
    );
  }
  @core.TypedRoute.Get(
    "customer/product/:id",
  ) public productAt(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.productAt(p, id),
    );
  }
  @core.TypedRoute.Patch("seller/product/:id/snapshot") public sellerProductSnapshots(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingProduct.ISnapshot>> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) => ShoppingProvider.productSnapshots(p, id, input, false));
  }
  @core.TypedRoute.Patch("admin/product") public adminProducts(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminProducts(p, input));
  }
  @core.TypedRoute.Get("admin/product/:id") public adminProductAt(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminProductAt(p, id));
  }
  @core.TypedRoute.Delete("admin/product/:id") public adminProductDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingAdmin.IReason): Promise<IEntity> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.policyDeleteProduct(p, id, body));
  }
  @core.TypedRoute.Patch("admin/product/:id/snapshot") public adminProductSnapshots(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingProduct.ISnapshot>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.productSnapshots(p, id, input, true));
  }
  @core.TypedRoute.Post("seller/product/:id/variant") public variantCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingProduct.IVariantCreate): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.variantCreate(p, id, body),
    );
  }
  @core.TypedRoute.Put("seller/product/:productId/variant/:id") public variantUpdate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "productId",
  ) productId: string & tags.Format<"uuid">, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingProduct.IVariantUpdate): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.variantUpdate(p, productId, id, body),
    );
  }
  @core.TypedRoute.Delete("seller/product/:productId/variant/:id") public variantDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "productId",
  ) productId: string & tags.Format<"uuid">, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.variantDelete(p, productId, id),
    );
  }
  @core.TypedRoute.Post("seller/product/variant/inventory/:id") public inventoryAdd(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingInventory.ICreate): Promise<IShoppingProduct.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.inventory(p, "", id, body),
    );
  }
  @core.TypedRoute.Patch("seller/product/variant/inventory/:id") public inventoryHistory(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() input: IPage.IRequest): Promise<IShoppingInventory.IHistory> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.inventoryHistory(p, "", id, input),
    );
  }

  @core.TypedRoute.Get("customer/cart") public cart(@core.TypedHeaders() headers: { authorization?: string }): Promise<IShoppingCart.ISummary> {
    return ShoppingProvider.authenticate(headers, "customer").then(
      ShoppingProvider.cart,
    );
  }
  @core.TypedRoute.Post("customer/cart") public cartAdd(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingCart.ICreate): Promise<IShoppingCart.ISummary> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.cartAdd(p, body),
    );
  }
  @core.TypedRoute.Put(
    "customer/cart/:id",
  ) public cartUpdate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingCart.IUpdate): Promise<IShoppingCart.ISummary> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.cartUpdate(p, id, body),
    );
  }
  @core.TypedRoute.Delete(
    "customer/cart/:id",
  ) public cartDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.cartDelete(p, id),
    );
  }
  @core.TypedRoute.Patch("customer/wishlist") public wishlist(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingWishlist.ISummary>> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.wishlist(p, input),
    );
  }
  @core.TypedRoute.Post("customer/wishlist/:id") public wishlistAdd(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.wishlistAdd(p, id),
    );
  }
  @core.TypedRoute.Delete("customer/wishlist/:id") public wishlistDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.wishlistDelete(p, id),
    );
  }

  @core.TypedRoute.Post("customer/checkout/start") public checkoutStart(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingCheckout.IStart): Promise<IShoppingCheckout.ISummary> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) => ShoppingProvider.checkoutStart(p, body));
  }
  @core.TypedRoute.Get("customer/checkout/:id") public checkoutReview(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingCheckout.ISummary> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) => ShoppingProvider.checkoutReview(p, id));
  }
  @core.TypedRoute.Post("customer/checkout/:id/payment") public checkoutPayment(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingCheckout.IPayment): Promise<IShoppingCheckout.IPaymentResult> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) => ShoppingProvider.checkoutPayment(p, id, body));
  }
  @core.TypedRoute.Patch("customer/order") public orderList(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingOrder.ISummary>> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.orderList(p, input),
    );
  }
  @core.TypedRoute.Get(
    "customer/order/:id",
  ) public orderAt(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.orderAt(p, id),
    );
  }
  @core.TypedRoute.Patch("admin/order") public adminOrderList(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IShoppingOrder.IAdminRequest): Promise<IPage<IShoppingAdmin.IOrderSummary>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminOrderList(p, input));
  }
  @core.TypedRoute.Get("admin/order/:id") public adminOrderAt(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminOrderAt(p, id));
  }
  @core.TypedRoute.Patch("admin/action") public adminActions(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IShoppingAdmin.IActionRequest): Promise<IPage<IShoppingAdmin.IAction>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminActions(p, input));
  }
  @core.TypedRoute.Put("admin/order-item/cancel/:id") public forceCancelItem(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingAdmin.IReason): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.forceCancelItem(p, id, body));
  }
  @core.TypedRoute.Put("admin/order/cancel/:id") public forceCancelOrder(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingAdmin.IReason): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.forceCancelOrder(p, id, body));
  }
  @core.TypedRoute.Put("admin/order-item/refund/:id") public forceRefundItem(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingAdmin.IReason): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.forceRefundItem(p, id, body));
  }
  @core.TypedRoute.Put("admin/order/refund/:id") public forceRefundOrder(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingAdmin.IReason): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.forceRefundOrder(p, id, body));
  }
  @core.TypedRoute.Post("seller/order/shipment/:id") public shipmentCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingShipment.ICreate): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.shipmentCreate(p, id, body),
    );
  }
  @core.TypedRoute.Put("customer/shipment/deliver/:id") public shipmentDeliver(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.shipmentDeliver(p, id),
    );
  }
  @core.TypedRoute.Get("customer/shipment/:id") public shipmentTrack(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) => ShoppingProvider.shipmentTrack(p, id));
  }
  @core.TypedRoute.Put("customer/shipment/auto-confirm/:id") public shipmentAutoConfirm(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingOrder.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) => ShoppingProvider.shipmentAutoConfirm(p, id));
  }
  @core.TypedRoute.Patch("seller/order-item") public sellerQueue(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IShoppingOrder.ISellerRequest): Promise<IPage<IShoppingOrder.IItem>> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.sellerQueue(p, input),
    );
  }
  @core.TypedRoute.Post("customer/cancellation") public cancellationCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingRequest.ICreate & { itemId: string }): Promise<IShoppingRequest.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.requestCreate(p, body.itemId, "cancellation", body),
    );
  }
  @core.TypedRoute.Post("customer/refund") public refundCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingRequest.ICreate & { itemId: string }): Promise<IShoppingRequest.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.requestCreate(p, body.itemId, "refund", body),
    );
  }
  @core.TypedRoute.Patch("seller/cancellation") public cancellationList(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingRequest.IDetail>> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.sellerRequests(p, "cancellation", input),
    );
  }
  @core.TypedRoute.Patch("seller/refund") public refundList(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingRequest.IDetail>> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.sellerRequests(p, "refund", input),
    );
  }
  @core.TypedRoute.Put("seller/request/approve/:id") public requestApprove(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IShoppingRequest.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.decideRequest(p, id, true),
    );
  }
  @core.TypedRoute.Put("seller/request/reject/:id") public requestReject(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IShoppingRequest.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.decideRequest(p, id, false),
    );
  }
  @core.TypedRoute.Post("customer/review") public reviewCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingReview.ICreate): Promise<IShoppingReview.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.reviewCreate(p, body),
    );
  }
  @core.TypedRoute.Put("customer/review/:id") public reviewUpdate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">, @core.TypedBody() body: IShoppingReview.IUpdate): Promise<IShoppingReview.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.reviewUpdate(p, id, body),
    );
  }
  @core.TypedRoute.Delete("customer/review/:id") public reviewDelete(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam(
    "id",
  ) id: string & tags.Format<"uuid">): Promise<IEntity> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.reviewDelete(p, id),
    );
  }

  @core.TypedRoute.Post("customer/admin-application") public adminApplicationCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingAdminApplication.ICreate): Promise<IShoppingAdminApplication.IDetail> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.adminApplicationCreate(p, body),
    );
  }
  @core.TypedRoute.Patch("customer/admin-application") public adminApplications(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingAdminApplication.IDetail>> {
    return ShoppingProvider.authenticate(headers, "customer").then((p) =>
      ShoppingProvider.adminApplications(p, input),
    );
  }
  @core.TypedRoute.Post("seller/admin-application") public sellerAdminApplicationCreate(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() body: IShoppingAdminApplication.ICreate): Promise<IShoppingAdminApplication.IDetail> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.adminApplicationCreate(p, body),
    );
  }
  @core.TypedRoute.Patch("seller/admin-application") public sellerAdminApplications(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingAdminApplication.IDetail>> {
    return ShoppingProvider.authenticate(headers, "seller").then((p) =>
      ShoppingProvider.adminApplications(p, input),
    );
  }
  @core.TypedRoute.Patch("admin/admin-application") public adminApplicationsPending(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingAdminApplication.IDetail>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminApplicationsPending(p, input));
  }
  @core.TypedRoute.Put("admin/admin-application/approve/:id") public adminApplicationApprove(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingAdminApplication.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminApplicationDecision(p, id, true));
  }
  @core.TypedRoute.Put("admin/admin-application/reject/:id") public adminApplicationReject(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingAdminApplication.IDetail> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminApplicationDecision(p, id, false));
  }
  @core.TypedRoute.Put("admin/grade/promote/:id") public adminGradePromote(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingAdmin.IUserSummary> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminGrade(p, id, true));
  }
  @core.TypedRoute.Put("admin/grade/demote/:id") public adminGradeDemote(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingAdmin.IUserSummary> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.adminGrade(p, id, false));
  }
  @core.TypedRoute.Patch("admin/customer") public adminCustomers(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingAdmin.IUserSummary>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.users(p, "customer", input));
  }
  @core.TypedRoute.Patch("admin/seller") public adminSellers(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IShoppingAdmin.IUserSummary>> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.users(p, "seller", input));
  }
  @core.TypedRoute.Put("admin/customer/ban/:id") public adminCustomerBan(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingAdmin.IUserSummary> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.userBan(p, id, true, "customer"));
  }
  @core.TypedRoute.Put("admin/customer/unban/:id") public adminCustomerUnban(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingAdmin.IUserSummary> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.userBan(p, id, false, "customer"));
  }
  @core.TypedRoute.Put("admin/seller/ban/:id") public adminSellerBan(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingAdmin.IUserSummary> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.userBan(p, id, true, "seller"));
  }
  @core.TypedRoute.Put("admin/seller/unban/:id") public adminSellerUnban(@core.TypedHeaders() headers: { authorization?: string }, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<IShoppingAdmin.IUserSummary> {
    return ShoppingProvider.authenticateAny(headers).then((p) => ShoppingProvider.userBan(p, id, false, "seller"));
  }
  @core.TypedRoute.Get("seller/dashboard") public sellerDashboard(@core.TypedHeaders() headers: { authorization?: string }): Promise<IShoppingAdmin.ISummary> {
    return ShoppingProvider.authenticate(headers, "seller").then(
      ShoppingProvider.dashboard,
    );
  }
}




