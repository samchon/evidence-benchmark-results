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

function isOrder(
  value: api.IShoppingOrder | { status: "failed" | "unknown" },
): value is api.IShoppingOrder {
  return "items" in value;
}

/**
 * Proves the public shopping journeys by carrying one catalog through
 * purchase, fulfillment, cancellation, refund, review, and administration.
 */
export async function test_api_shopping_business_journey(
  connection: api.IConnection,
): Promise<void> {
  const admin = TestAutomation.adminConnection();
  const customer = { host: connection.host } satisfies api.IConnection;
  const customerCredentials = {
    email: email("journey-customer"),
    password: "customer123",
  } satisfies api.IShoppingCustomer.IJoin;
  const customerAuth = await api.functional.shopping.auth.customer.join.customerJoin(
    customer,
    customerCredentials,
  );
  typia.assert(customerAuth);
  const profile = await api.functional.shopping.customer.profile.customerProfileUpdate(
    customer,
    { displayName: "Journey Customer", phoneNumber: "+821012345678" },
  );
  typia.assert(profile);
  const address = await api.functional.shopping.customer.address.addressCreate(
    customer,
    {
      recipientName: "Journey Customer",
      recipientPhone: "+821012345678",
      streetAddress: "1 Commerce Road",
      city: "Seoul",
      stateOrProvince: "Seoul",
      postalCode: "04500",
      country: "KR",
    },
  );
  typia.assert(address);
  const defaulted = await api.functional.shopping.customer.address._default.addressDefault(
    customer,
    address.id,
  );
  typia.assert(defaulted);
  const addresses = await api.functional.shopping.customer.address.addressIndex(
    customer,
    { page: 1, limit: 10 },
  );
  typia.assert(addresses);
  if (addresses.data.length !== 1 || addresses.data[0]?.isDefault !== true)
    throw new Error("The saved address/default journey did not persist.");

  const seller = { host: connection.host } satisfies api.IConnection;
  const sellerCredentials = {
    email: email("journey-seller"),
    password: "seller1234",
  } satisfies api.IShoppingSeller.IJoin;
  const sellerAuth = await api.functional.shopping.auth.seller.join.sellerJoin(
    seller,
    sellerCredentials,
  );
  typia.assert(sellerAuth);
  const sellerProfile = await api.functional.shopping.seller.profile.sellerProfileUpdate(
    seller,
    { shopName: "Journey Shop", shopDescription: "Reliable goods", logo: null },
  );
  typia.assert(sellerProfile);
  const sellerLogo = await api.functional.shopping.seller.profile.sellerProfileUpdate(
    seller,
    { shopName: "Journey Shop", shopDescription: "Reliable goods", logo: "https://example.com/journey-logo.png" },
  );
  typia.assert(sellerLogo);
  const preservedSellerLogo = await api.functional.shopping.seller.profile.sellerProfileUpdate(
    seller,
    { shopName: "Journey Shop", shopDescription: "Reliable goods" },
  );
  typia.assert(preservedSellerLogo);
  if (preservedSellerLogo.logo !== sellerLogo.logo)
    throw new Error("Omitting seller logo cleared the existing logo.");
  const sellerProfileSnapshots = await api.functional.shopping.seller.profile.snapshot.sellerProfileSnapshots(seller, { page: 1, limit: 0 });
  typia.assert(sellerProfileSnapshots);
  if (!sellerProfileSnapshots.data.some((item) => item.changed.includes("shopDescription") && item.after.shopDescription === "Reliable goods"))
    throw new Error("Seller profile edits did not retain complete profile snapshot outcomes.");
  const pendingSellers = await api.functional.shopping.admin.approval.seller.sellerApprovalIndex(
    admin,
    { page: 1, limit: 0 },
  );
  typia.assert(pendingSellers);
  const sellerRequest = pendingSellers.data.find(
    (item) => item.sellerId === sellerAuth.actor.id,
  );
  if (sellerRequest === undefined) throw new Error("Seller approval was not queued.");
  const approvedSeller = await api.functional.shopping.admin.approval.seller.approve.sellerApprove(
    admin,
    sellerRequest.id,
  );
  typia.assert(approvedSeller);
  if (approvedSeller.approvalState !== "approved")
    throw new Error("Seller approval did not change seller state.");

  const category = await api.functional.shopping.admin.category.categoryCreate(
    admin,
    { name: "Journey", description: "Journey products" },
  );
  typia.assert(category);
  const child = await api.functional.shopping.admin.category.categoryCreate(admin, {
    name: "Featured",
    description: "Featured journey products",
    parentId: category.id,
  });
  typia.assert(child);
  const editedCategory = await api.functional.shopping.admin.category.categoryUpdate(
    admin,
    category.id,
    { name: "Journey Goods", description: "Updated journey products" },
  );
  typia.assert(editedCategory);
  const categoryTree = await api.functional.shopping.customer.category.categoryIndex(
    customer,
  );
  typia.assert(categoryTree);
  const sellerCategoryTree = await api.functional.shopping.customer.category.categoryIndex(
    seller,
  );
  typia.assert(sellerCategoryTree);
  if (JSON.stringify(sellerCategoryTree) !== JSON.stringify(categoryTree))
    throw new Error("Seller category browsing returned a different taxonomy.");

  const product = await api.functional.shopping.seller.product.productCreate(
    seller,
    {
      name: "Journey Mug",
      description: "A durable test mug",
      categoryId: child.id,
      basePrice: 10,
    },
  );
  typia.assert(product);
  const renamedProduct = await api.functional.shopping.seller.product.productUpdate(seller, product.id, {
    name: "Journey Travel Mug",
    description: product.description,
    categoryId: child.id,
    basePrice: product.basePrice,
  });
  typia.assert(renamedProduct);
  if (renamedProduct.name !== "Journey Travel Mug")
    throw new Error("The single-field product edit did not persist.");
  const withImages = await api.functional.shopping.seller.product.image.imageUpload(
    seller,
    product.id,
    { urls: ["https://example.com/a.png", "https://example.com/b.png"] },
  );
  typia.assert(withImages);
  const imageIds = withImages.images.map((image) => image.id).reverse();
  const reordered = await api.functional.shopping.seller.product.image.imageReorder(
    seller,
    product.id,
    { imageIds },
  );
  typia.assert(reordered);
  const imageRemoved = await api.functional.shopping.seller.product.image.imageDelete(
    seller,
    product.id,
    imageIds[1] ?? "missing-image",
  );
  typia.assert(imageRemoved);
  const variant = await api.functional.shopping.seller.product.variant.variantCreate(
    seller,
    product.id,
    { sku: `JOURNEY-${Date.now()}`, options: { Color: "Red", Size: "M" }, priceOverride: 12 },
  );
  typia.assert(variant);
  const editedVariant = await api.functional.shopping.seller.product.variant.variantUpdate(
    seller,
    variant.id,
    { sku: variant.sku, options: variant.options, priceOverride: 12 },
  );
  typia.assert(editedVariant);
  const stocked = await api.functional.shopping.seller.product.variant.restock(
    seller,
    variant.id,
    { quantity: 10, reason: "initial stock" },
  );
  typia.assert(stocked);
  const ledger = await api.functional.shopping.seller.product.variant.inventory(
    seller,
    variant.id,
    { page: 1, limit: 0 },
  );
  typia.assert(ledger);
  if (ledger.data[0]?.quantityChange !== 10)
    throw new Error("The inventory ledger did not record the restock.");
  const adjusted = await api.functional.shopping.seller.product.variant.subtract(
    seller,
    variant.id,
    { quantity: 1, reason: "inventory adjustment" },
  );
  typia.assert(adjusted);
  if (adjusted.stock !== 9) throw new Error("Inventory subtraction did not reduce stock.");
  const restored = await api.functional.shopping.seller.product.variant.restock(
    seller,
    variant.id,
    { quantity: 1, reason: "adjustment correction" },
  );
  typia.assert(restored);
  if (restored.stock !== 10) throw new Error("Inventory restock did not restore stock.");
  const snapshots = await api.functional.shopping.seller.product.snapshot.productSnapshots(
    seller,
    product.id,
    { page: 1, limit: 0 },
  );
  typia.assert(snapshots);
  const nameOnlySnapshot = snapshots.data.find((item) => item.changed.length === 1 && item.changed[0] === "name");
  if (snapshots.data.length < 5 || snapshots.data.some((item) => item.after === undefined) || nameOnlySnapshot === undefined || nameOnlySnapshot.before.name !== "Journey Mug" || nameOnlySnapshot.after.name !== "Journey Travel Mug" || nameOnlySnapshot.after.description !== product.description || nameOnlySnapshot.after.categoryId !== child.id || nameOnlySnapshot.after.basePrice !== product.basePrice)
    throw new Error("Catalog edits did not retain complete product snapshot outcomes.");
  const adminSnapshots = await api.functional.shopping.admin.product.snapshot.adminProductSnapshots(
    admin,
    product.id,
    { page: 1, limit: 0 },
  );
  typia.assert(adminSnapshots);

  const search = await api.functional.shopping.customer.product.productIndex(
    customer,
    { search: " mug ", categoryId: child.id, inStock: true, page: 1, limit: 10 },
  );
  typia.assert(search);
  if (!search.data.some((item) => item.id === product.id))
    throw new Error("The stocked product was not discoverable.");
  const detail = await api.functional.shopping.customer.product.productAt(
    customer,
    product.id,
  );
  typia.assert(detail);
  const publicSeller = await api.functional.shopping.customer.seller.sellerPublic(
    customer,
    sellerAuth.actor.id,
  );
  typia.assert(publicSeller);
  const wished = await api.functional.shopping.customer.wishlist.wishlistAdd(
    customer,
    product.id,
  );
  typia.assert(wished);
  const wishlist = await api.functional.shopping.customer.wishlist.wishlistIndex(
    customer,
    { page: 1, limit: 10 },
  );
  typia.assert(wishlist);
  const cartAfterAdd = await api.functional.shopping.customer.cart.cartAdd(
    customer,
    variant.id,
    { quantity: 1 },
  );
  typia.assert(cartAfterAdd);
  const cartAfterMerge = await api.functional.shopping.customer.cart.cartAdd(
    customer,
    variant.id,
    { quantity: 2 },
  );
  typia.assert(cartAfterMerge);
  const line = cartAfterMerge.lines[0];
  if (line === undefined || line.quantity !== 3)
    throw new Error("Repeated cart additions did not merge.");
  await rejected(() =>
    api.functional.shopping.customer.cart.cartUpdate(customer, line.id, {
      quantity: 0,
    }),
  );
  const cartUpdated = await api.functional.shopping.customer.cart.cartUpdate(
    customer,
    line.id,
    { quantity: 2 },
  );
  typia.assert(cartUpdated);
  const cartRead = await api.functional.shopping.customer.cart.cartAt(customer);
  typia.assert(cartRead);

  const unknownCheckout = await api.functional.shopping.customer.checkout.checkout(
    customer,
    { addressId: address.id },
  );
  const unknown = await api.functional.shopping.customer.checkout.payment(
    customer,
    {
      attemptId: unknownCheckout.attemptId,
      success: "unknown",
      amount: unknownCheckout.totalPrice,
    },
  );
  typia.assert(unknown);
  if (unknown.status !== "unknown")
    throw new Error("Unknown payment outcome was not retained for reconciliation.");
  const priceChanged = await api.functional.shopping.seller.product.variant.variantUpdate(
    seller,
    variant.id,
    { sku: variant.sku, options: variant.options, priceOverride: 13 },
  );
  typia.assert(priceChanged);
  await rejected(() =>
    api.functional.shopping.customer.checkout.payment(customer, {
      attemptId: unknownCheckout.attemptId,
      success: true,
      amount: unknownCheckout.totalPrice,
    }),
  );
  const priceRestored = await api.functional.shopping.seller.product.variant.variantUpdate(
    seller,
    variant.id,
    { sku: variant.sku, options: variant.options, priceOverride: 12 },
  );
  typia.assert(priceRestored);
  await rejected(() =>
    api.functional.shopping.customer.checkout.checkout(customer, {
      addressId: address.id,
    }),
  );
  const reconciled = await api.functional.shopping.customer.checkout.payment(
    customer,
    {
      attemptId: unknownCheckout.attemptId,
      success: true,
      amount: unknownCheckout.totalPrice,
    },
  );
  typia.assert(reconciled);
  if (!isOrder(reconciled))
    throw new Error("The unresolved payment did not reconcile to an order.");
  await api.functional.shopping.admin.order.refund.forceRefundOrder(
    admin,
    reconciled.id,
    { reason: "Reconciliation test settlement" },
  );
  const retryCart = await api.functional.shopping.customer.cart.cartAdd(
    customer,
    variant.id,
    { quantity: 1 },
  );
  typia.assert(retryCart);

  const failedCheckout = await api.functional.shopping.customer.checkout.checkout(
    customer,
    { addressId: address.id },
  );
  typia.assert(failedCheckout);
  const failurePriceChanged = await api.functional.shopping.seller.product.variant.variantUpdate(
    seller,
    variant.id,
    { sku: variant.sku, options: variant.options, priceOverride: 14 },
  );
  typia.assert(failurePriceChanged);
  const failed = await api.functional.shopping.customer.checkout.payment(
    customer,
    { attemptId: failedCheckout.attemptId, success: false, amount: failedCheckout.totalPrice },
  );
  typia.assert(failed);
  if (failed.status !== "failed") throw new Error("Payment failure was not terminal.");
  const failurePriceRestored = await api.functional.shopping.seller.product.variant.variantUpdate(
    seller,
    variant.id,
    { sku: variant.sku, options: variant.options, priceOverride: 12 },
  );
  typia.assert(failurePriceRestored);
  const cartAfterFailure = await api.functional.shopping.customer.cart.cartAt(customer);
  typia.assert(cartAfterFailure);
  const failedLineId = failedCheckout.items[0]?.id;
  const failedLine = failedLineId === undefined ? undefined : cartAfterFailure.lines.find((line) => line.id === failedLineId);
  if (failedLine === undefined || failedLine.quantity !== failedCheckout.items[0]?.quantity)
    throw new Error("Payment failure did not retain the selected cart line.");
  await rejected(() =>
    api.functional.shopping.customer.checkout.payment(customer, {
      attemptId: failedCheckout.attemptId,
      success: true,
      amount: failedCheckout.totalPrice,
    }),
  );
  const checkout = await api.functional.shopping.customer.checkout.checkout(customer, {
    addressId: address.id,
  });
  typia.assert(checkout);
  const placed = await api.functional.shopping.customer.checkout.payment(customer, {
    attemptId: checkout.attemptId,
    success: true,
    amount: checkout.totalPrice,
  });
  typia.assert(placed);
  if (!isOrder(placed) || placed.items.length !== 1)
    throw new Error("Successful checkout did not create one order item.");
  const order = placed;
  const orderList = await api.functional.shopping.customer.order.orderIndex(customer, {
    page: 1,
    limit: 10,
  });
  typia.assert(orderList);
  const orderDetails = await api.functional.shopping.customer.order.orderAt(customer, order.id);
  typia.assert(orderDetails);
  const sellerQueue = await api.functional.shopping.seller.order.item.shippingQueue(seller, {
    page: 1,
    limit: 0,
  });
  typia.assert(sellerQueue);
  const sellerDashboard = await api.functional.shopping.seller.dashboard.dashboard(seller);
  typia.assert(sellerDashboard);
  if (sellerDashboard.products < 1 || sellerDashboard.orderItems < 1 || sellerDashboard.pendingCancellations !== 0 || sellerDashboard.pendingRefunds !== 0)
    throw new Error("Seller dashboard did not report the settled shop outcome.");
  const sellerItems = await api.functional.shopping.seller.dashboard.order_item.sellerItems(
    seller,
    { page: 1, limit: 0, status: "paid" },
  );
  typia.assert(sellerItems);
  const shipped = await api.functional.shopping.seller.shipment.shipmentCreate(seller, {
    itemIds: [order.items[0]?.id ?? "missing-item"],
    carrier: "Journey Carrier",
    trackingNumber: `TRACK-${Date.now()}`,
  });
  typia.assert(shipped);
  const delivered = await api.functional.shopping.customer.shipment.deliver.shipmentDeliver(
    customer,
    shipped.id,
  );
  typia.assert(delivered);
  const refundRequest = await api.functional.shopping.customer.order.item.refund.refundCreate(
    customer,
    order.items[0]?.id ?? "missing-item",
    { reason: "The item arrived damaged" },
  );
  typia.assert(refundRequest);
  const refundQueue = await api.functional.shopping.seller.refund.refundIndex(seller, {
    page: 1,
    limit: 0,
  });
  typia.assert(refundQueue);
  const refundResult = await api.functional.shopping.seller.refund.approve.refundApprove(
    seller,
    refundRequest.id,
  );
  typia.assert(refundResult);
  if (refundResult.status !== "approved") throw new Error("Refund was not approved.");
  const refundSnapshots = await api.functional.shopping.customer.order.snapshot.orderSnapshots(customer, order.id, { page: 1, limit: 0 });
  typia.assert(refundSnapshots);
  if (!refundSnapshots.data.some((item) => item.kind === "refundDecision" && item.before.status === "pending" && item.after.status === "approved"))
    throw new Error("Refund decision did not retain before/after snapshot evidence.");

  await api.functional.shopping.customer.wishlist.wishlistDelete(customer, product.id);
  const disposableCart = await api.functional.shopping.customer.cart.cartAdd(customer, variant.id, {
    quantity: 1,
  });
  typia.assert(disposableCart);
  const disposableLine = disposableCart.lines[0];
  if (disposableLine === undefined) throw new Error("Cart deletion setup did not create a line.");
  const cartRemoved = await api.functional.shopping.customer.cart.cartDelete(
    customer,
    disposableLine.id,
  );
  typia.assert(cartRemoved);
  const secondCart = await api.functional.shopping.customer.cart.cartAdd(customer, variant.id, {
    quantity: 1,
  });
  typia.assert(secondCart);
  const secondCheckout = await api.functional.shopping.customer.checkout.checkout(customer, {
    addressId: address.id,
  });
  const secondOrder = await api.functional.shopping.customer.checkout.payment(customer, {
    attemptId: secondCheckout.attemptId,
    success: true,
    amount: secondCheckout.totalPrice,
  });
  typia.assert(secondOrder);
  if (!isOrder(secondOrder)) throw new Error("Second checkout failed.");
  const cancellationRequest = await api.functional.shopping.customer.order.item.cancellation.cancellationCreate(
    customer,
    secondOrder.items[0]?.id ?? "missing-item",
    { reason: "Changed my mind" },
  );
  typia.assert(cancellationRequest);
  await rejected(() =>
    api.functional.shopping.customer.order.item.cancellation.cancellationCreate(
      customer,
      secondOrder.items[0]?.id ?? "missing-item",
      { reason: "Duplicate request" },
    ),
  );
  const cancellationRejected = await api.functional.shopping.seller.cancellation.reject.cancellationReject(
    seller,
    cancellationRequest.id,
  );
  typia.assert(cancellationRejected);
  if (cancellationRejected.status !== "rejected")
    throw new Error("Cancellation rejection did not persist.");
  const cancellationRetry = await api.functional.shopping.customer.order.item.cancellation.cancellationCreate(
    customer,
    secondOrder.items[0]?.id ?? "missing-item",
    { reason: "Changed my mind after all" },
  );
  typia.assert(cancellationRetry);
  const cancellationQueue = await api.functional.shopping.seller.cancellation.cancellationIndex(
    seller,
    { page: 1, limit: 0 },
  );
  typia.assert(cancellationQueue);
  const cancellationResult = await api.functional.shopping.seller.cancellation.approve.cancellationApprove(
    seller,
    cancellationRetry.id,
  );
  typia.assert(cancellationResult);
  if (cancellationResult.status !== "approved")
    throw new Error("Cancellation was not approved.");
  const cancellationSnapshots = await api.functional.shopping.customer.order.snapshot.orderSnapshots(customer, secondOrder.id, { page: 1, limit: 0 });
  typia.assert(cancellationSnapshots);
  if (!cancellationSnapshots.data.some((item) => item.kind === "cancellationDecision" && item.before.status === "pending" && item.after.status === "approved"))
    throw new Error("Cancellation decision did not retain before/after snapshot evidence.");
  const adminCancellationSnapshots = await api.functional.shopping.admin.order.snapshot.adminOrderSnapshots(admin, secondOrder.id, { page: 1, limit: 0 });
  typia.assert(adminCancellationSnapshots);
  if (!adminCancellationSnapshots.data.some((item) => item.kind === "cancellationDecision"))
    throw new Error("Administrator order snapshot inspection did not retain cancellation evidence.");
  const sellerCancellationSnapshots = await api.functional.shopping.seller.order.snapshot.sellerOrderSnapshots(seller, secondOrder.id, { page: 1, limit: 0 });
  typia.assert(sellerCancellationSnapshots);
  if (!sellerCancellationSnapshots.data.some((item) => item.kind === "cancellationDecision"))
    throw new Error("Seller order snapshot inspection did not retain cancellation evidence.");

  const thirdCart = await api.functional.shopping.customer.cart.cartAdd(customer, variant.id, {
    quantity: 1,
  });
  typia.assert(thirdCart);
  const thirdCheckout = await api.functional.shopping.customer.checkout.checkout(customer, {
    addressId: address.id,
  });
  const thirdOrder = await api.functional.shopping.customer.checkout.payment(customer, {
    attemptId: thirdCheckout.attemptId,
    success: true,
    amount: thirdCheckout.totalPrice,
  });
  typia.assert(thirdOrder);
  if (!isOrder(thirdOrder)) throw new Error("Third checkout failed.");
  const forceRefunded = await api.functional.shopping.admin.order.item.refund.forceRefundItem(
    admin,
    thirdOrder.items[0]?.id ?? "missing-item",
    { reason: "Policy resolution" },
  );
  typia.assert(forceRefunded);
  if (forceRefunded.items[0]?.status !== "refunded")
    throw new Error("Administrator force refund did not change the item.");
  if (!(forceRefunded.forcedActions ?? []).some((action) => action.kind === "forceRefund" && action.beforeStatus === "paid" && action.afterStatus === "refunded"))
    throw new Error("Administrator force refund did not retain before/after audit state.");

  const forceCancelCart = await api.functional.shopping.customer.cart.cartAdd(customer, variant.id, {
    quantity: 1,
  });
  typia.assert(forceCancelCart);
  const forceCancelCheckout = await api.functional.shopping.customer.checkout.checkout(customer, {
    addressId: address.id,
  });
  const forceCancelPaid = await api.functional.shopping.customer.checkout.payment(customer, {
    attemptId: forceCancelCheckout.attemptId,
    success: true,
    amount: forceCancelCheckout.totalPrice,
  });
  typia.assert(forceCancelPaid);
  if (!isOrder(forceCancelPaid)) throw new Error("Item force-cancel order was not created.");
  const forceCancelled = await api.functional.shopping.admin.order.item.cancel.forceCancelItem(
    admin,
    forceCancelPaid.items[0]?.id ?? "missing-item",
    { reason: "Item-level policy resolution" },
  );
  typia.assert(forceCancelled);
  if (forceCancelled.items[0]?.status !== "cancelled")
    throw new Error("Administrator item force cancellation did not change the item.");
  if (!(forceCancelled.forcedActions ?? []).some((action) => action.kind === "forceCancellation" && action.beforeStatus === "paid" && action.afterStatus === "cancelled"))
    throw new Error("Administrator force cancellation did not retain before/after audit state.");

  const fourthCart = await api.functional.shopping.customer.cart.cartAdd(customer, variant.id, {
    quantity: 1,
  });
  typia.assert(fourthCart);
  const fourthCheckout = await api.functional.shopping.customer.checkout.checkout(customer, {
    addressId: address.id,
  });
  const fourthOrder = await api.functional.shopping.customer.checkout.payment(customer, {
    attemptId: fourthCheckout.attemptId,
    success: true,
    amount: fourthCheckout.totalPrice,
  });
  typia.assert(fourthOrder);
  if (!isOrder(fourthOrder)) throw new Error("Fourth checkout failed.");
  const fourthShipment = await api.functional.shopping.seller.shipment.shipmentCreate(seller, {
    itemIds: [fourthOrder.items[0]?.id ?? "missing-item"],
    carrier: "Journey Carrier",
    trackingNumber: `TRACK-REVIEW-${Date.now()}`,
  });
  typia.assert(fourthShipment);
  await api.functional.shopping.customer.shipment.deliver.shipmentDeliver(
    customer,
    fourthShipment.id,
  );
  const rejectedRefund = await api.functional.shopping.customer.order.item.refund.refundCreate(
    customer,
    fourthOrder.items[0]?.id ?? "missing-item",
    { reason: "Requesting review before final decision" },
  );
  typia.assert(rejectedRefund);
  const rejectedRefundResult = await api.functional.shopping.seller.refund.reject.refundReject(
    seller,
    rejectedRefund.id,
  );
  typia.assert(rejectedRefundResult);
  if (rejectedRefundResult.status !== "rejected")
    throw new Error("Refund rejection did not persist.");
  const review = await api.functional.shopping.customer.order.product.review.reviewCreate(
    customer,
    fourthOrder.id,
    product.id,
    { rating: 5, text: "Excellent" },
  );
  typia.assert(review);
  const editedReview = await api.functional.shopping.customer.review.reviewUpdate(
    customer,
    review.id,
    { rating: 4, text: "Still good" },
  );
  typia.assert(editedReview);
  await api.functional.shopping.customer.review.reviewDelete(customer, review.id);
  const reviewSnapshots = await api.functional.shopping.customer.review.snapshot.reviewSnapshots(customer, review.id, { page: 1, limit: 0 });
  typia.assert(reviewSnapshots);
  if (!reviewSnapshots.data.some((item) => item.kind === "review" && item.before.rating === 5 && item.after.rating === 4) || !reviewSnapshots.data.some((item) => item.kind === "reviewDelete" && item.before.deleted === false && item.after.deleted === true))
    throw new Error("Review edits did not retain complete review snapshot outcomes.");

  const applicant = { host: connection.host } satisfies api.IConnection;
  const applicantCredentials = { email: email("journey-applicant"), password: "applicant123" } satisfies api.IShoppingCustomer.IJoin;
  const applicantAuth = await api.functional.shopping.auth.customer.join.customerJoin(applicant, applicantCredentials);
  typia.assert(applicantAuth);
  const application = await api.functional.shopping.customer.administrator_application.customerApply(
    applicant,
    { reason: "I can moderate the marketplace" },
  );
  typia.assert(application);
  const ownApplications = await api.functional.shopping.customer.administrator_application.customerApplications(
    applicant,
    { page: 1, limit: 10 },
  );
  typia.assert(ownApplications);
  const pendingApplications = await api.functional.shopping.admin.administrator_application.pendingApplications(
    admin,
    { page: 1, limit: 0 },
  );
  typia.assert(pendingApplications);
  const approvedApplication = await api.functional.shopping.admin.administrator_application.approve.applicationApprove(
    admin,
    application.id,
  );
  typia.assert(approvedApplication);
  await api.functional.shopping.admin.administrator.promote(
    admin,
    "customer",
    applicantAuth.actor.id,
  );
  await api.functional.shopping.admin.administrator.demote(
    admin,
    "customer",
    applicantAuth.actor.id,
  );
  await api.functional.shopping.admin.customer.ban.customerBan(admin, applicantAuth.actor.id);
  await rejected(() =>
    api.functional.shopping.auth.customer.login.customerLogin({ host: connection.host }, applicantCredentials),
  );
  await rejected(() =>
    api.functional.shopping.auth.customer.login.customerLogin({ host: connection.host }, {
      email: "never-used@example.com",
      password: "wrongpassword",
    }),
  );
  await api.functional.shopping.admin.customer.unban.customerUnban(admin, applicantAuth.actor.id);
  const applicantAfterUnban = { host: connection.host } satisfies api.IConnection;
  await api.functional.shopping.auth.customer.login.customerLogin(applicantAfterUnban, applicantCredentials);
  await api.functional.shopping.customer.account.customerDelete(applicantAfterUnban, { password: applicantCredentials.password });
  const replacement = await api.functional.shopping.auth.customer.join.customerJoin(
    { host: connection.host },
    applicantCredentials,
  );
  typia.assert(replacement);

  await api.functional.shopping.admin.seller.suspend.sellerSuspend(admin, sellerAuth.actor.id);
  await rejected(() =>
    api.functional.shopping.seller.product.productUpdate(seller, product.id, {
      name: "Blocked edit",
      description: "Blocked edit",
      categoryId: child.id,
      basePrice: 12,
    }),
  );
  await api.functional.shopping.admin.seller.unsuspend.sellerUnsuspend(admin, sellerAuth.actor.id);
  const uncategorized = await api.functional.shopping.admin.category.categoryDelete(admin, category.id);
  typia.assert(uncategorized);
  const uncategorizedCategory = await MySetupWizard.productCategory(product.id);
  if (uncategorizedCategory !== null)
    throw new Error("Category retirement did not uncategorize the retained product.");
  const movementCountBeforeRetirement = await MySetupWizard.inventoryMovementCount(variant.id);
  await api.functional.shopping.seller.product.variant.variantDelete(seller, variant.id);
  const movementCountAfterVariantRetirement = await MySetupWizard.inventoryMovementCount(variant.id);
  if (movementCountAfterVariantRetirement !== 0 || movementCountBeforeRetirement === 0)
    throw new Error("Variant retirement did not remove the working inventory ledger.");
  await api.functional.shopping.seller.product.productDelete(seller, product.id);
  const movementCountAfterProductRetirement = await MySetupWizard.inventoryMovementCount(variant.id);
  if (movementCountAfterProductRetirement !== 0)
    throw new Error("Product retirement did not remove the working inventory ledger.");
  const deletionSnapshots = await api.functional.shopping.seller.product.snapshot.productSnapshots(
    seller,
    product.id,
    { page: 1, limit: 0 },
  );
  typia.assert(deletionSnapshots);
  const deletionSnapshot = deletionSnapshots.data.find((item) => item.changed.includes("deletedAt"));
  if (deletionSnapshot === undefined || deletionSnapshot.before === undefined || deletionSnapshot.after === undefined)
    throw new Error("Product retirement did not retain a complete deletion snapshot.");
  await rejected(() =>
    api.functional.shopping.customer.product.productAt(customer, product.id),
  );
  const adminProducts = await api.functional.shopping.admin.product.adminProductIndex(admin, {
    page: 1,
    limit: 0,
  });
  typia.assert(adminProducts);
  const platformOrders = await api.functional.shopping.admin.order.adminOrderIndex(admin, {
    page: 1,
    limit: 0,
  });
  typia.assert(platformOrders);
  const platformOrder = await api.functional.shopping.admin.order.adminOrderAt(
    admin,
    order.id,
  );
  typia.assert(platformOrder);
  const customerDirectory = await api.functional.shopping.admin.customer.customerDirectory(admin, {
    page: 1,
    limit: 0,
  });
  typia.assert(customerDirectory);
  const sellerDirectory = await api.functional.shopping.admin.seller.sellerDirectory(admin, {
    page: 1,
    limit: 0,
  });
  typia.assert(sellerDirectory);
  const adminSellerProfileSnapshots = await api.functional.shopping.admin.seller.snapshot.adminSellerProfileSnapshots(admin, sellerAuth.actor.id, { page: 1, limit: 0 });
  typia.assert(adminSellerProfileSnapshots);
  if (adminSellerProfileSnapshots.data.length === 0)
    throw new Error("Administrator seller-profile snapshot inspection returned no evidence.");
  await rejected(() =>
    api.functional.shopping.customer.product.productIndex({ host: connection.host }, {
      page: 1,
      limit: 10,
    }),
  );

  await api.functional.shopping.customer.auth.session.customerLogout(customer);
  await api.functional.shopping.seller.auth.session.sellerLogout(seller);
}

/** Proves recovery is delivered out of band and consumed exactly once. */
export async function test_api_shopping_recovery_delivery(
  connection: api.IConnection,
): Promise<void> {
  const recoveryConnection = { host: connection.host } satisfies api.IConnection;
  const credentials = { email: email("recovery-delivery"), password: "oldpassword" } satisfies api.IShoppingCustomer.IJoin;
  await api.functional.shopping.auth.customer.join.customerJoin(recoveryConnection, credentials);
  const accepted = await api.functional.shopping.auth.customer.password.recovery.customerRecoveryRequest(
    { host: connection.host },
    { email: credentials.email },
  );
  typia.assert(accepted);
  if (accepted.accepted !== true || "token" in accepted)
    throw new Error("Recovery returned the secret instead of an acceptance receipt.");
  const delivery = await MySetupWizard.latestRecoveryDelivery(credentials.email);
  if (delivery.recipient !== credentials.email || delivery.kind !== "passwordRecovery")
    throw new Error("Recovery delivery was addressed incorrectly.");
  if (new Date(delivery.payload.expiresAt).getTime() !== new Date(delivery.expiresAt).getTime())
    throw new Error("Recovery delivery expiry was not retained.");
  await api.functional.shopping.auth.customer.password.recovery.customerRecoveryComplete(
    { host: connection.host },
    { token: delivery.payload.token, newPassword: "newpassword" },
  );
  await rejected(() =>
    api.functional.shopping.auth.customer.password.recovery.customerRecoveryComplete(
      { host: connection.host },
      { token: delivery.payload.token, newPassword: "anotherpassword" },
    ),
  );
  const login = await api.functional.shopping.auth.customer.login.customerLogin(
    { host: connection.host },
    { email: credentials.email, password: "newpassword" },
  );
  typia.assert(login);
}
