import * as api from "@benchmark/shopping-api";
import typia from "typia";

import { MyGlobal } from "../../../src/MyGlobal";
import { MySetupWizard } from "../../../src/setup/MySetupWizard";

const unique = (label: string): string => `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const connection = (base: api.IConnection, authorized: api.IShoppingAuth.IAuthorized): api.IConnection => ({
  host: base.host,
  headers: { Authorization: `Bearer ${authorized.token}` },
});
const mustReject = async (call: () => Promise<unknown>, message: string): Promise<void> => {
  try {
    await call();
    throw new Error(message);
  } catch (error) {
    if (!(error instanceof api.HttpError) || error.status < 400) throw error;
  }
};

/** Exercises each published business operation through a durable customer/seller journey. */
export async function test_api_business_journey(base: api.IConnection): Promise<void> {
  const admin = await api.functional.shopping.auth.customer.join.customerJoin(base, { email: `${unique("admin")}@example.com`, password: "password-123" });
  const customer = await api.functional.shopping.auth.customer.join.customerJoin(base, { email: `${unique("buyer")}@example.com`, password: "password-123" });
  const applicantEmail = `${unique("applicant")}@example.com`;
  const applicant = await api.functional.shopping.auth.customer.join.customerJoin(base, { email: applicantEmail, password: "password-123" });
  const victim = await api.functional.shopping.auth.customer.join.customerJoin(base, { email: `${unique("victim")}@example.com`, password: "password-123" });
  const sellerEmail = `${unique("seller")}@example.com`;
  const seller = await api.functional.shopping.auth.seller.join.sellerJoin(base, { email: sellerEmail, password: "password-123" });
  const sellerTwoEmail = `${unique("seller-two")}@example.com`;
  const secondSeller = await api.functional.shopping.auth.seller.join.sellerJoin(base, { email: sellerTwoEmail, password: "password-123" });
  const adminConnection = connection(base, admin);
  const customerConnection = connection(base, customer);
  const applicantConnection = connection(base, applicant);
  const victimConnection = connection(base, victim);
  const sellerConnection = connection(base, seller);
  const secondSellerConnection = connection(base, secondSeller);

  // Controlled setup is deliberately outside ordinary registration.
  const wasTesting = MyGlobal.testing;
  MyGlobal.testing = true;
  try {
    await MySetupWizard.provisionSuperAdmin(admin.id);
  } finally {
    MyGlobal.testing = wasTesting;
  }

  const pendingSellerRows = await api.functional.shopping.admin.seller.approval.sellerApprovals(adminConnection, { page: 1, limit: 100 });
  typia.assert(pendingSellerRows);
  const sellerApproval = pendingSellerRows.data.find((row) => row.sellerId === seller.id);
  if (!sellerApproval || sellerApproval.status !== "pending") throw new Error("seller approval queue omitted the pending seller");
  const approvedSeller = await api.functional.shopping.admin.seller.approval.approve.sellerApprove(adminConnection, sellerApproval.id);
  typia.assert(approvedSeller);
  if (approvedSeller.status !== "approved") throw new Error("seller approval did not become approved");

  const secondApprovalRows = await api.functional.shopping.admin.seller.approval.sellerApprovals(adminConnection, { page: 1, limit: 100 });
  const secondApproval = secondApprovalRows.data.find((row) => row.sellerId === secondSeller.id);
  if (!secondApproval) throw new Error("second seller approval was not queued");
  const rejected = await api.functional.shopping.admin.seller.approval.reject.sellerReject(adminConnection, secondApproval.id, { reason: "Needs more information" });
  if (rejected.status !== "rejected" || rejected.reason !== "Needs more information") throw new Error("seller rejection reason was not retained");
  const secondStatus = await api.functional.shopping.seller.approval.sellerApproval(secondSellerConnection);
  if (secondStatus.status !== "rejected") throw new Error("seller did not observe its rejection");
  const resubmitted = await api.functional.shopping.seller.approval.resubmit.sellerApprovalResubmit(secondSellerConnection);
  if (resubmitted.status !== "pending") throw new Error("seller resubmission did not reopen approval");
  const resubmitRows = await api.functional.shopping.admin.seller.approval.sellerApprovals(adminConnection, { page: 1, limit: 100 });
  const resubmit = resubmitRows.data.find((row) => row.sellerId === secondSeller.id);
  if (!resubmit) throw new Error("resubmitted approval was not queued");
  await api.functional.shopping.admin.seller.approval.approve.sellerApprove(adminConnection, resubmit.id);

  const top = await api.functional.shopping.admin.category.categoryCreate(adminConnection, { name: unique("Top"), description: "Top category" });
  const child = await api.functional.shopping.admin.category.categoryCreate(adminConnection, { name: unique("Child"), description: "Child category", parentId: top.id });
  const changedChild = await api.functional.shopping.admin.category.categoryUpdate(adminConnection, child.id, { name: "Updated Child", description: "Updated description" });
  if (changedChild.name !== "Updated Child") throw new Error("category update was not persisted");
  const retiredCategory = await api.functional.shopping.admin.category.categoryCreate(adminConnection, { name: unique("Retired"), description: "Retired category" });
  const retiredCategoryResult = await api.functional.shopping.admin.category.categoryDelete(adminConnection, retiredCategory.id);
  if (retiredCategoryResult.id !== retiredCategory.id) throw new Error("category deletion returned the wrong category");
  const categoryTree = await api.functional.shopping.customer.category.categories(customerConnection);
  if (!categoryTree.some((row) => row.id === top.id && row.children.some((entry) => entry.id === child.id))) throw new Error("customer category tree omitted the child");

  const sellerProfile = await api.functional.shopping.seller.profile.sellerProfile(sellerConnection);
  if (sellerProfile.approvalStatus !== "approved") throw new Error("approved seller cannot read its status");
  const sellerEdited = await api.functional.shopping.seller.profile.sellerProfileUpdate(sellerConnection, { shopName: "Journey Shop", shopDescription: "Journey seller", shopLogo: "https://example.com/journey.png" });
  if (sellerEdited.shopName !== "Journey Shop") throw new Error("seller profile edit was not persisted");
  const sellerSnapshots = await api.functional.shopping.seller.profile.snapshot.sellerProfileSnapshots(sellerConnection, { page: 1, limit: 10 });
  if (!sellerSnapshots.data.some((row) => row.changedFields.includes("shop_name"))) throw new Error("seller profile evidence was not created");
  const publicProfile = await api.functional.shopping.seller.profile.sellerProfilePublic(customerConnection, seller.id);
  if (publicProfile.shopName !== "Journey Shop") throw new Error("customer saw stale public seller profile");

  const product = await api.functional.shopping.seller.product.productCreate(sellerConnection, { name: "Journey Product", description: "A product for the complete journey", categoryId: child.id, basePrice: 10 });
  const updatedProduct = await api.functional.shopping.seller.product.productUpdate(sellerConnection, product.id, { name: "Journey Product Updated", description: "Updated journey product", categoryId: child.id, basePrice: 12 });
  if (updatedProduct.basePrice !== 12) throw new Error("product update was not persisted");
  const firstImage = await api.functional.shopping.seller.product.image.imageUpload(sellerConnection, product.id, { uri: "https://example.com/one.png" });
  const secondImage = await api.functional.shopping.seller.product.image.imageUpload(sellerConnection, product.id, { uri: "https://example.com/two.png" });
  const imageIds = secondImage.images.map((image) => image.id).reverse();
  const reordered = await api.functional.shopping.seller.product.image.imageReorder(sellerConnection, product.id, { imageIds });
  if (reordered.images[0]?.id !== imageIds[0]) throw new Error("image reorder did not change the thumbnail");
  const deletedImage = await api.functional.shopping.seller.product.image.imageDelete(sellerConnection, firstImage.images[0]!.id);
  if (deletedImage.images.length !== 1) throw new Error("image deletion did not retain the remaining image");
  const variant = await api.functional.shopping.seller.product.variant.variantCreate(sellerConnection, product.id, { sku: unique("SKU"), options: { color: "blue" }, priceOverride: 15 });
  const variantId = variant.variants[0]!.id;
  const changedVariant = await api.functional.shopping.seller.product.variant.variantUpdate(sellerConnection, product.id, variantId, { sku: variant.variants[0]!.sku, options: { color: "green" }, priceOverride: 16 });
  if (changedVariant.variants[0]?.priceOverride !== 16) throw new Error("variant update was not persisted");
  const stocked = await api.functional.shopping.seller.product.variant.inventory.inventoryAdd(sellerConnection, variantId, { quantity: 8, reason: "initial stock", operation: "restock" });
  if (stocked.variants.find((entry) => entry.id === variantId)?.stock !== 8) throw new Error("restock did not change stock");
  const inventoryHistory = await api.functional.shopping.seller.product.variant.inventory.inventoryHistory(sellerConnection, variantId, { page: 1, limit: 10 });
  if (inventoryHistory.currentStock !== 8) throw new Error("inventory history reported an incorrect current stock projection");
  if (!inventoryHistory.data.some((row) => row.quantity === 8 && row.reason === "initial stock")) throw new Error("inventory history omitted the restock");
  const adjusted = await api.functional.shopping.seller.product.variant.inventory.inventoryAdd(sellerConnection, variantId, { quantity: 1, reason: "damaged unit", operation: "loss" });
  if (adjusted.variants.find((entry) => entry.id === variantId)?.stock !== 7) throw new Error("loss movement did not subtract stock");

  const customerCategories = await api.functional.shopping.customer.category.categories(customerConnection);
  if (!customerCategories.length) throw new Error("customer category list was empty after creation");
  const categoryPage = await api.functional.shopping.customer.category.product.categoryProducts(customerConnection, child.id, { page: 1, limit: 10 });
  if (!categoryPage.data.some((row) => row.id === product.id)) throw new Error("category product list omitted the live product");
  const productPage = await api.functional.shopping.customer.product.products(customerConnection, { page: 1, limit: 10, search: "journey product", sort: "priceAsc", inStock: true });
  if (!productPage.data.some((row) => row.id === product.id && row.available)) throw new Error("product search omitted the purchasable product");
  const productPageTwo = await api.functional.shopping.customer.product.products(customerConnection, { page: 2, limit: 10, search: "journey product", sort: "priceAsc", inStock: true });
  typia.assert(productPageTwo);
  await mustReject(() => api.functional.shopping.customer.product.products(customerConnection, { page: 2, limit: 10, search: "different", sort: "priceAsc", inStock: true }), "changed product pagination context was accepted");
  const detail = await api.functional.shopping.customer.product.productAt(customerConnection, product.id);
  if (detail.variants[0]?.stock !== 7 || detail.available !== true) throw new Error("product detail did not expose current variant stock");

  await api.functional.shopping.customer.wishlist.wishlistAdd(customerConnection, product.id);
  await api.functional.shopping.customer.wishlist.wishlistAdd(customerConnection, product.id);
  const wishlist = await api.functional.shopping.customer.wishlist.wishlist(customerConnection, { page: 1, limit: 10 });
  if (wishlist.data.filter((entry) => entry.productId === product.id).length !== 1) throw new Error("wishlist save was not idempotent");
  const wishlistPageTwo = await api.functional.shopping.customer.wishlist.wishlist(customerConnection, { page: 2, limit: 10 });
  typia.assert(wishlistPageTwo);
  await mustReject(() => api.functional.shopping.customer.wishlist.wishlist(customerConnection, { page: 2, limit: 20 }), "changed wishlist pagination context was accepted");
  const wishlistRemoved = await api.functional.shopping.customer.wishlist.wishlistDelete(customerConnection, product.id);
  if (wishlistRemoved.id !== product.id) throw new Error("wishlist removal returned the wrong product");

  const address = await api.functional.shopping.customer.address.customerAddressCreate(customerConnection, { recipientName: "Journey Buyer", phone: "+1-555-0200", streetAddress: "20 Journey Road", city: "Seoul", state: "Seoul", postalCode: "04500", country: "KR" });
  await api.functional.shopping.customer.address.customerAddressUpdate(customerConnection, address.id, { recipientName: "Journey Buyer Updated", phone: "+1-555-0201", streetAddress: "21 Journey Road", city: "Seoul", state: "Seoul", postalCode: "04500", country: "KR" });
  await api.functional.shopping.customer.address._default.customerAddressDefault(customerConnection, address.id);
  const addresses = await api.functional.shopping.customer.address.customerAddresses(customerConnection, { page: 1, limit: 10 });
  if (!addresses.data.some((entry) => entry.id === address.id && entry.isDefault)) throw new Error("default address was not retained");
  const removableAddress = await api.functional.shopping.customer.address.customerAddressCreate(customerConnection, { recipientName: "Remove Me", phone: "+1-555-0202", streetAddress: "22 Journey Road", city: "Seoul", state: "Seoul", postalCode: "04500", country: "KR" });
  const removedAddress = await api.functional.shopping.customer.address.customerAddressDelete(customerConnection, removableAddress.id);
  if (removedAddress.id !== removableAddress.id) throw new Error("address deletion returned the wrong address");
  const emptyCart = await api.functional.shopping.customer.cart.cart(customerConnection);
  typia.assert(emptyCart);
  const cartAfterFirst = await api.functional.shopping.customer.cart.cartAdd(customerConnection, { variantId, quantity: 2 });
  if (cartAfterFirst.lines[0]?.quantity !== 2) throw new Error("cart add did not create the line");
  const cartAfterMerge = await api.functional.shopping.customer.cart.cartAdd(customerConnection, { variantId, quantity: 1 });
  const cartLine = cartAfterMerge.lines.find((line) => line.variantId === variantId);
  if (cartLine?.quantity !== 3) throw new Error("repeated cart add did not accumulate");
  const cartUpdated = await api.functional.shopping.customer.cart.cartUpdate(customerConnection, cartLine!.id, { quantity: 2 });
  if (cartUpdated.lines.find((line) => line.id === cartLine!.id)?.quantity !== 2) throw new Error("cart quantity replacement failed");
  const checkout = await api.functional.shopping.customer.checkout.start.checkoutStart(customerConnection, { addressId: address.id });
  const reviewed = await api.functional.shopping.customer.checkout.checkoutReview(customerConnection, checkout.id);
  if (reviewed.total !== checkout.total) throw new Error("checkout review changed the reviewed total");
  const failed = await api.functional.shopping.customer.checkout.payment.checkoutPayment(customerConnection, checkout.id, { paymentAttemptId: unique("failed-payment"), status: "failed", amount: checkout.total });
  if (failed.status !== "failed") throw new Error("failed payment did not remain failed");
  const retryCheckout = await api.functional.shopping.customer.checkout.start.checkoutStart(customerConnection, { addressId: address.id });
  const paymentAttemptId = unique("payment");
  const payment = await api.functional.shopping.customer.checkout.payment.checkoutPayment(customerConnection, retryCheckout.id, { paymentAttemptId, status: "succeeded", amount: retryCheckout.total });
  if (payment.status !== "succeeded" || payment.order === undefined) throw new Error("successful payment did not create an order");
  const repeated = await api.functional.shopping.customer.checkout.payment.checkoutPayment(customerConnection, retryCheckout.id, { paymentAttemptId, status: "succeeded", amount: retryCheckout.total });
  if (repeated.status !== "succeeded" || repeated.order?.id !== payment.order.id) throw new Error("repeated payment notification created a different order");
  await mustReject(() => api.functional.shopping.customer.checkout.payment.checkoutPayment(customerConnection, retryCheckout.id, { paymentAttemptId, status: "failed", amount: retryCheckout.total }), "a succeeded payment attempt accepted an incompatible terminal outcome");
  const order = payment.order;
  const orderList = await api.functional.shopping.customer.order.orderList(customerConnection, { page: 1, limit: 10 });
  if (!orderList.data.some((row) => row.id === order.id)) throw new Error("customer order list omitted the paid order");
  const orderDetail = await api.functional.shopping.customer.order.orderAt(customerConnection, order.id);
  const itemId = orderDetail.items[0]!.id;
  const sellerQueue = await api.functional.shopping.seller.order_item.sellerQueue(sellerConnection, { page: 1, limit: 10, status: "paid" });
  if (!sellerQueue.data.some((item) => item.id === itemId)) throw new Error("seller queue omitted the paid item");
  const shipment = await api.functional.shopping.seller.order.shipment.shipmentCreate(sellerConnection, order.id, { itemIds: [itemId], carrier: "Journey Carrier", trackingNumber: unique("TRACK") });
  const shipmentId = shipment.shipments[0]!.id;
  const tracked = await api.functional.shopping.customer.shipment.shipmentTrack(customerConnection, shipmentId);
  if (!tracked.shipments.some((entry) => entry.id === shipmentId)) throw new Error("shipment tracking omitted the package");
  const delivered = await api.functional.shopping.customer.shipment.deliver.shipmentDeliver(customerConnection, shipmentId);
  if (delivered.items[0]?.status !== "delivered") throw new Error("shipment delivery did not update the item");
  await mustReject(() => api.functional.shopping.customer.shipment.deliver.shipmentDeliver(customerConnection, shipmentId), "a delivered shipment accepted a second delivery confirmation");
  const autoConfirmed = await api.functional.shopping.customer.shipment.auto_confirm.shipmentAutoConfirm(customerConnection, shipmentId);
  typia.assert(autoConfirmed);
  const review = await api.functional.shopping.customer.review.reviewCreate(customerConnection, { productId: product.id, orderId: order.id, rating: 5, text: "Excellent" });
  const editedReview = await api.functional.shopping.customer.review.reviewUpdate(customerConnection, review.id, { rating: 4, text: "Still excellent" });
  if (editedReview.rating !== 4 || editedReview.text !== "Still excellent") throw new Error("review edit was not persisted");
  const refund = await api.functional.shopping.customer.refund.refundCreate(customerConnection, { itemId, reason: "Changed my mind" });
  if (refund.status !== "pending") throw new Error("refund request did not enter pending state");
  const refundQueue = await api.functional.shopping.seller.refund.refundList(sellerConnection, { page: 1, limit: 10 });
  if (!refundQueue.data.some((entry) => entry.id === refund.id)) throw new Error("seller refund queue omitted the request");
  const approvedRefund = await api.functional.shopping.seller.request.approve.requestApprove(sellerConnection, refund.id);
  if (approvedRefund.status !== "approved") throw new Error("seller refund decision was not persisted");
  const refundedOrder = await api.functional.shopping.customer.order.orderAt(customerConnection, order.id);
  if (refundedOrder.items[0]?.status !== "refunded" || refundedOrder.items[0]?.refundAmount !== 32) throw new Error("refund status or amount was not reflected");
  await api.functional.shopping.customer.review.reviewDelete(customerConnection, review.id);
  await mustReject(() => api.functional.shopping.customer.review.reviewCreate(customerConnection, { productId: product.id, orderId: order.id, rating: 3, text: "duplicate" }), "deleted review tuple was reusable");

  const removableCart = await api.functional.shopping.customer.cart.cartAdd(customerConnection, { variantId, quantity: 1 });
  const removableCartLine = removableCart.lines.find((line) => line.variantId === variantId);
  if (!removableCartLine) throw new Error("cart line for deletion was not created");
  const removedCart = await api.functional.shopping.customer.cart.cartDelete(customerConnection, removableCartLine.id);
  if (removedCart.id !== removableCartLine.id) throw new Error("cart deletion returned the wrong line");
  const secondOrderCart = await api.functional.shopping.customer.cart.cartAdd(customerConnection, { variantId, quantity: 1 });
  const secondCheckout = await api.functional.shopping.customer.checkout.start.checkoutStart(customerConnection, { addressId: address.id });
  const secondPayment = await api.functional.shopping.customer.checkout.payment.checkoutPayment(customerConnection, secondCheckout.id, { paymentAttemptId: unique("second-payment"), status: "succeeded", amount: secondCheckout.total });
  const secondOrder = secondPayment.order!;
  const secondItemId = secondOrder.items[0]!.id;
  const cancellation = await api.functional.shopping.customer.cancellation.cancellationCreate(customerConnection, { itemId: secondItemId, reason: "Please cancel" });
  const cancellationQueue = await api.functional.shopping.seller.cancellation.cancellationList(sellerConnection, { page: 1, limit: 10 });
  if (!cancellationQueue.data.some((entry) => entry.id === cancellation.id)) throw new Error("seller cancellation queue omitted the request");
  const rejectedCancellation = await api.functional.shopping.seller.request.reject.requestReject(sellerConnection, cancellation.id);
  if (rejectedCancellation.status !== "rejected") throw new Error("seller cancellation rejection was not persisted");
  const forceCancelled = await api.functional.shopping.admin.order.cancel.forceCancelOrder(adminConnection, secondOrder.id, { reason: "Administrative cancellation" });
  const expectedCancellationRefund = secondOrder.items[0]!.unitPrice * secondOrder.items[0]!.quantity;
  if (forceCancelled.items[0]?.status !== "cancelled" || forceCancelled.items[0]?.refundAmount !== expectedCancellationRefund) throw new Error("administrator order cancellation did not persist the refunded line amount");
  await mustReject(() => api.functional.shopping.admin.order_item.cancel.forceCancelItem(adminConnection, secondItemId, { reason: "duplicate cancellation" }), "administrator cancelled an already cancelled item");
  await mustReject(() => api.functional.shopping.admin.order.refund.forceRefundOrder(adminConnection, order.id, { reason: "duplicate refund" }), "administrator refunded an already refunded order");
  await mustReject(() => api.functional.shopping.admin.order_item.refund.forceRefundItem(adminConnection, itemId, { reason: "duplicate refund" }), "administrator refunded an already refunded item");

  const adminProducts = await api.functional.shopping.admin.product.adminProducts(adminConnection, { page: 1, limit: 100 });
  if (!adminProducts.data.some((row) => row.id === product.id)) throw new Error("administrator product list omitted the product");
  const adminProduct = await api.functional.shopping.admin.product.adminProductAt(adminConnection, product.id);
  if (adminProduct.id !== product.id) throw new Error("administrator product detail returned the wrong product");
  const sellerProductSnapshots = await api.functional.shopping.seller.product.snapshot.sellerProductSnapshots(sellerConnection, product.id, { page: 1, limit: 100 });
  if (!sellerProductSnapshots.data.length) throw new Error("seller product snapshots were not recorded");
  const adminSnapshots = await api.functional.shopping.admin.product.snapshot.adminProductSnapshots(adminConnection, product.id, { page: 1, limit: 100 });
  if (!adminSnapshots.data.length) throw new Error("administrator product snapshots were not visible");
  const adminOrders = await api.functional.shopping.admin.order.adminOrderList(adminConnection, { page: 1, limit: 100, customerId: customer.id });
  if (!adminOrders.data.some((row) => row.id === order.id)) throw new Error("administrator order list omitted the order");
  const adminOrder = await api.functional.shopping.admin.order.adminOrderAt(adminConnection, order.id);
  if (!adminOrder.adminActions) throw new Error("administrator order detail omitted its action ledger");
  const actions = await api.functional.shopping.admin.action.adminActions(adminConnection, { page: 1, limit: 100 });
  typia.assert(actions);

  const pendingApplication = await api.functional.shopping.customer.admin_application.adminApplicationCreate(applicantConnection, { reason: "I can help govern the marketplace" });
  if (pendingApplication.applicantKind !== "customer" || pendingApplication.status !== "pending") throw new Error("customer administrator application lost its actor kind");
  const personalApplications = await api.functional.shopping.customer.admin_application.adminApplications(applicantConnection, { page: 1, limit: 10 });
  if (!personalApplications.data.some((entry) => entry.id === pendingApplication.id)) throw new Error("applicant could not see its application");
  const pendingApplications = await api.functional.shopping.admin.admin_application.adminApplicationsPending(adminConnection, { page: 1, limit: 100 });
  const pendingApplicationRow = pendingApplications.data.find((entry) => entry.id === pendingApplication.id);
  if (!pendingApplicationRow || pendingApplicationRow.applicantKind !== "customer") throw new Error("pending administrator queue omitted applicant kind");
  const approvedApplication = await api.functional.shopping.admin.admin_application.approve.adminApplicationApprove(adminConnection, pendingApplication.id);
  if (approvedApplication.status !== "approved") throw new Error("administrator application approval failed");
  const rejectedApplication = await api.functional.shopping.customer.admin_application.adminApplicationCreate(victimConnection, { reason: "A separate governance request" });
  const rejectedApplicationResult = await api.functional.shopping.admin.admin_application.reject.adminApplicationReject(adminConnection, rejectedApplication.id);
  if (rejectedApplicationResult.status !== "rejected") throw new Error("administrator application rejection failed");
  const promoted = await api.functional.shopping.admin.grade.promote.adminGradePromote(adminConnection, applicant.id);
  if (!promoted.grades.includes("superAdministrator")) throw new Error("administrator promotion did not grant super authority");
  const demoted = await api.functional.shopping.admin.grade.demote.adminGradeDemote(adminConnection, applicant.id);
  if (demoted.grades.includes("superAdministrator") || !demoted.grades.includes("regularAdministrator")) throw new Error("administrator demotion removed the regular grade");
  const deletedApplicant = await api.functional.shopping.customer.account.customerAccountDelete(applicantConnection, { password: "password-123" });
  if (deletedApplicant.id !== applicant.id) throw new Error("regular administrator account deletion returned the wrong identity");
  await mustReject(() => api.functional.shopping.auth.customer.login.customerLogin(base, { email: applicantEmail, password: "password-123" }), "closed administrator account remained usable");

  const customers = await api.functional.shopping.admin.customer.adminCustomers(adminConnection, { page: 1, limit: 100 });
  if (!customers.data.some((row) => row.id === customer.id)) throw new Error("administrator customer list omitted the customer");
  const bannedCustomer = await api.functional.shopping.admin.customer.ban.adminCustomerBan(adminConnection, victim.id);
  if (!bannedCustomer.banned) throw new Error("customer ban did not change login state");
  await mustReject(() => api.functional.shopping.auth.customer.login.customerLogin(base, { email: `${unique("not-used")}@example.com`, password: "password-123" }), "invalid login unexpectedly succeeded");
  const unbannedCustomer = await api.functional.shopping.admin.customer.unban.adminCustomerUnban(adminConnection, victim.id);
  if (unbannedCustomer.banned) throw new Error("customer unban did not restore active state");
  const sellers = await api.functional.shopping.admin.seller.adminSellers(adminConnection, { page: 1, limit: 100 });
  if (!sellers.data.some((row) => row.id === seller.id)) throw new Error("administrator seller list omitted the seller");
  const sellerSuspended = await api.functional.shopping.admin.seller.suspend.sellerSuspend(adminConnection, seller.id);
  if (!sellerSuspended.suspended) throw new Error("seller suspension did not change state");
  await mustReject(() => api.functional.shopping.seller.product.productUpdate(sellerConnection, product.id, { name: "blocked", description: "blocked", categoryId: child.id, basePrice: 1 }), "suspended seller edited a product");
  const sellerUnsuspended = await api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend(adminConnection, seller.id);
  if (sellerUnsuspended.suspended) throw new Error("seller unsuspension did not restore catalog authority");
  const sellerAdminSnapshots = await api.functional.shopping.admin.seller.snapshot.adminSellerProfileSnapshots(adminConnection, seller.id, { page: 1, limit: 100 });
  typia.assert(sellerAdminSnapshots);
  const sellerDashboard = await api.functional.shopping.seller.dashboard.sellerDashboard(sellerConnection);
  if (sellerDashboard.orderItems < 1) throw new Error("seller dashboard omitted the paid-order count");
  const sellerBanned = await api.functional.shopping.admin.seller.ban.adminSellerBan(adminConnection, secondSeller.id);
  if (!sellerBanned.banned) throw new Error("seller ban did not change state");
  const sellerUnbanned = await api.functional.shopping.admin.seller.unban.adminSellerUnban(adminConnection, secondSeller.id);
  if (sellerUnbanned.banned) throw new Error("seller unban did not restore state");
  const secondSellerActive = await api.functional.shopping.auth.seller.login.sellerLogin(base, { email: sellerTwoEmail, password: "password-123" });
  const secondSellerActiveConnection = connection(base, secondSellerActive);

  const disposableProduct = await api.functional.shopping.seller.product.productCreate(sellerConnection, { name: "Disposable Product", description: "Deleted after creation", categoryId: child.id, basePrice: 1 });
  const deletedProduct = await api.functional.shopping.seller.product.productDelete(sellerConnection, disposableProduct.id);
  if (deletedProduct.id !== disposableProduct.id) throw new Error("seller product deletion returned the wrong product");
  const nestedProduct = await api.functional.shopping.seller.product.productCreate(sellerConnection, { name: "Nested Category Product", description: "Uncategorized after parent deletion", categoryId: child.id, basePrice: 2 });
  const deletedTop = await api.functional.shopping.admin.category.categoryDelete(adminConnection, top.id);
  if (deletedTop.id !== top.id) throw new Error("top-level category deletion returned the wrong category");
  const uncategorizedProducts = await api.functional.shopping.customer.product.products(customerConnection, { page: 1, limit: 100, search: "Nested Category Product" });
  if (!uncategorizedProducts.data.some((row) => row.id === nestedProduct.id)) throw new Error("deleting a parent category hid a child-category product");

  const policyDeleted = await api.functional.shopping.admin.product.adminProductDelete(adminConnection, product.id, { reason: "Policy test" });
  if (policyDeleted.id !== product.id) throw new Error("administrator policy deletion returned the wrong product");
  const retainedSnapshots = await api.functional.shopping.admin.product.snapshot.adminProductSnapshots(adminConnection, product.id, { page: 1, limit: 100 });
  if (!retainedSnapshots.data.length) throw new Error("policy deletion removed retained product evidence");
  await mustReject(() => api.functional.shopping.customer.product.productAt(customerConnection, product.id), "policy-deleted product remained live");
  await mustReject(() => api.functional.shopping.seller.product.variant.variantDelete(sellerConnection, product.id, variantId), "deleted product still exposed a live variant");

  const disposableEmail = `${unique("disposable")}@example.com`;
  const disposable = await api.functional.shopping.auth.customer.join.customerJoin(base, { email: disposableEmail, password: "password-123" });
  const disposableConnection = connection(base, disposable);
  const changedPassword = await api.functional.shopping.customer.password.customerPassword(disposableConnection, { currentPassword: "password-123", newPassword: "password-456" });
  if (changedPassword.id !== disposable.id) throw new Error("customer password change failed");
  const refreshed = await api.functional.shopping.auth.customer.refresh.customerRefresh(base, { refreshToken: disposable.refreshToken });
  if (refreshed.id !== disposable.id) throw new Error("customer refresh changed identity");
  const disposableProfile = await api.functional.shopping.customer.profile.customerProfile(connection(base, refreshed));
  const disposableProfileEdit = await api.functional.shopping.customer.profile.customerProfileUpdate(connection(base, refreshed), { displayName: "Disposable Shopper", phone: "+1-555-0399" });
  if (disposableProfile.id !== disposable.id || disposableProfileEdit.displayName !== "Disposable Shopper") throw new Error("customer profile operations did not persist");
  await api.functional.shopping.customer.logout.customerLogout(connection(base, refreshed));
  const relogged = await api.functional.shopping.auth.customer.login.customerLogin(base, { email: disposableEmail, password: "password-456" });
  if (relogged.id !== disposable.id) throw new Error("customer password replacement did not permit re-login");
  await api.functional.shopping.customer.logout_all.customerLogoutAll(connection(base, relogged));
  const recoveredChallenge = await api.functional.shopping.auth.customer.recovery.customerRecoveryRequest(base, { email: disposableEmail });
  await api.functional.shopping.auth.customer.recovery.customerRecoveryComplete(base, { token: recoveredChallenge.token, newPassword: "password-789" });
  const recovered = await api.functional.shopping.auth.customer.login.customerLogin(base, { email: disposableEmail, password: "password-789" });
  const deletedDisposable = await api.functional.shopping.customer.account.customerAccountDelete(connection(base, recovered), { password: "password-789" });
  if (deletedDisposable.id !== disposable.id) throw new Error("customer account deletion returned the wrong identity");

  const authSeller = await api.functional.shopping.auth.seller.login.sellerLogin(base, { email: `${unique("missing-seller")}@example.com`, password: "password-123" }).catch(() => undefined);
  if (authSeller !== undefined) throw new Error("an unknown seller login unexpectedly succeeded");
  const sellerPassword = await api.functional.shopping.seller.password.sellerPassword(secondSellerActiveConnection, { currentPassword: "password-123", newPassword: "password-456" });
  if (sellerPassword.id !== secondSeller.id) throw new Error("seller password change failed");
  const secondSellerLoggedIn = await api.functional.shopping.auth.seller.login.sellerLogin(base, { email: sellerTwoEmail, password: "password-456" });
  const sellerRefresh = await api.functional.shopping.auth.seller.refresh.sellerRefresh(base, { refreshToken: secondSellerLoggedIn.refreshToken });
  if (sellerRefresh.id !== secondSeller.id) throw new Error("seller refresh changed identity");
  const sellerRecoveryChallenge = await api.functional.shopping.auth.seller.recovery.sellerRecoveryRequest(base, { email: sellerTwoEmail });
  await api.functional.shopping.auth.seller.recovery.sellerRecoveryComplete(base, { token: sellerRecoveryChallenge.token, newPassword: "password-789" });
  const sellerRecovered = await api.functional.shopping.auth.seller.login.sellerLogin(base, { email: sellerTwoEmail, password: "password-789" });
  const deletedSecondSeller = await api.functional.shopping.seller.account.sellerAccountDelete(connection(base, sellerRecovered), { password: "password-789" });
  if (deletedSecondSeller.id !== secondSeller.id) throw new Error("seller account deletion returned the wrong identity");
  const sellerLoggedIn = await api.functional.shopping.auth.seller.login.sellerLogin(base, { email: sellerEmail, password: "password-123" });
  await api.functional.shopping.seller.logout.sellerLogout(connection(base, sellerLoggedIn));
  const sellerRelogged = await api.functional.shopping.auth.seller.login.sellerLogin(base, { email: sellerEmail, password: "password-123" });
  await api.functional.shopping.seller.logout_all.sellerLogoutAll(connection(base, sellerRelogged));
  const health = await api.functional.health.get(base);
  typia.assert(health);
}
