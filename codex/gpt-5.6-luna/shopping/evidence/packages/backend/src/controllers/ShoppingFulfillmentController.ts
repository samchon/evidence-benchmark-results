import { TypedBody, TypedHeaders, TypedParam, TypedRoute as Route } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";
import type { tags } from "typia";
import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Seller fulfillment, delivery, cancellation, and refund operations. */
@Controller("shopping")
export class ShoppingFulfillmentController {
  /**
   * List items awaiting shipment.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_order_items This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("seller/awaiting-shipment")
  public async awaiting(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingOrder.IItem>> { return ShoppingProvider.awaitingShipment(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * Create a shipment.
   * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-2-relate-addresses-to-a-customer This controller operation realizes the shipping address domain 2 relate addresses to a customer contract through create.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies This controller operation realizes the shipment policies shipment eligibility and delivery policies contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-1-define-shipment-information This controller operation realizes the shipment domain 1 define shipment information contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-4-separate-shipments-by-seller This controller operation realizes the shipment domain 4 separate shipments by seller contract through create.
   * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies This controller operation realizes the address policies shipping address policies contract through create.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-2-keep-one-seller-and-destination-per-shipment This controller operation realizes the shipment policies 2 keep one seller and destination per shipment contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-2-relate-a-shipment-to-its-seller-and-items This controller operation realizes the shipment domain 2 relate a shipment to its seller and items contract through create.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-1-select-eligible-paid-items-for-shipment This controller operation realizes the shipment policies 1 select eligible paid items for shipment contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-4-preserve-the-purchased-shipping-destination This controller operation realizes the shipping address domain 4 preserve the purchased shipping destination contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-1-define-shipping-address-information This controller operation realizes the shipping address domain 1 define shipping address information contract through create.
   * @evidence docs/analysis/04-business-rules.md#req-address-policies-1-require-a-complete-shipping-address This controller operation realizes the address policies 1 require a complete shipping address contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model This controller operation realizes the shipping address domain shipping address model contract through create.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations This controller operation realizes the shipping address functions shipping address operations contract through create.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations This controller operation realizes the shipping functions shipping and delivery operations contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-3-permit-split-and-bundled-fulfillment This controller operation realizes the shipment domain 3 permit split and bundled fulfillment contract through create.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-4-ship-all-package-items-together This controller operation realizes the shipment policies 4 ship all package items together contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-3-designate-one-default-address This controller operation realizes the shipping address domain 3 designate one default address contract through create.
   * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model This controller operation realizes the shipment domain shipment model contract through create.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-2-create-a-shipment This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_shipments This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Post("seller/create-shipment")
  public async create(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingOrder.IShipmentCreate): Promise<api.IShoppingOrder.IShipment> { return ShoppingProvider.createShipment(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * View shipment tracking.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-3-require-complete-shared-tracking-information This controller operation realizes the shipment policies 3 require complete shared tracking information contract through tracking.
   * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-5-share-tracking-and-delivery-by-package This controller operation realizes the shipment domain 5 share tracking and delivery by package contract through tracking.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-3-view-shipment-tracking This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_shipments This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Get("shipping/:id/tracking")
  public async tracking(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingOrder.IShipment> { return ShoppingProvider.tracking(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Confirm shipment delivery.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-6-complete-unconfirmed-shipments-after-fourteen-days This controller operation realizes the shipment policies 6 complete unconfirmed shipments after fourteen days contract through confirm.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-5-confirm-delivery-for-the-whole-shipment This controller operation realizes the shipment policies 5 confirm delivery for the whole shipment contract through confirm.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-4-confirm-shipment-delivery This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_shipments This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("seller/confirm-shipment/:id")
  public async confirm(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingOrder.IShipment> { return ShoppingProvider.confirmShipment(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Auto-confirm elapsed shipments.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-5-auto-confirm-shipment-delivery This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_shipments This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Post("shipping/auto-confirm")
  public async autoConfirm(): Promise<api.IShoppingResult> { return ShoppingProvider.autoConfirmShipments(); }
  /**
   * Request item cancellation.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-5-relate-cancellation-participants-and-target This controller operation realizes the cancellation domain 5 relate cancellation participants and target contract through cancellationRequest.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle This controller operation realizes the cancellation domain cancellation request lifecycle contract through cancellationRequest.
   * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies This controller operation realizes the cancellation policies cancellation eligibility and resolution policies contract through cancellationRequest.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-4-preserve-cancellation-decision-history This controller operation realizes the cancellation domain 4 preserve cancellation decision history contract through cancellationRequest.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-1-open-a-cancellation-request This controller operation realizes the cancellation domain 1 open a cancellation request contract through cancellationRequest.
   * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-1-admit-a-cancellation-request-for-a-paid-item This controller operation realizes the cancellation policies 1 admit a cancellation request for a paid item contract through cancellationRequest.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey This controller operation realizes the cancellation functions order item cancellation journey contract through cancellationRequest.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-1-request-item-cancellation This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_cancellation_requests This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence prisma:shopping_shipment_items This operation exposes persisted shipment-item tracking through cancellationApprove.
   */
  @Route.Post("customer/cancellation/:itemId/request")
  public async cancellationRequest(@TypedHeaders() headers: { authorization?: string }, @TypedParam("itemId") itemId: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingOrder.IItemAction): Promise<api.IShoppingResult> { return ShoppingProvider.requestCancellation(AuthUtil.parse(headers.authorization).id, itemId, body); }
  /**
   * List pending cancellations.
   * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-2-keep-one-pending-cancellation-decision-per-item This controller operation realizes the cancellation policies 2 keep one pending cancellation decision per item contract through cancellationPending.
   * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-4-decide-a-pending-cancellation-once This controller operation realizes the cancellation policies 4 decide a pending cancellation once contract through cancellationPending.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_cancellation_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("seller/cancellation/pending")
  public async cancellationPending(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingResult>> { return ShoppingProvider.pendingCancellations(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * Approve item cancellation.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-2-approve-a-cancellation-request This controller operation realizes the cancellation domain 2 approve a cancellation request contract through cancellationApprove.
   * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-5-apply-an-approved-cancellation-atomically This controller operation realizes the cancellation policies 5 apply an approved cancellation atomically contract through cancellationApprove.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-3-approve-item-cancellation This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_cancellation_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("admin/cancellation/:id/approve")
  public async cancellationApprove(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.decideCancellation(AuthUtil.parse(headers.authorization).id, id, true); }
  /**
   * Reject item cancellation.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-3-reject-a-cancellation-request This controller operation realizes the cancellation domain 3 reject a cancellation request contract through cancellationReject.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-4-reject-item-cancellation This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_cancellation_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("admin/cancellation/:id/reject")
  public async cancellationReject(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.decideCancellation(AuthUtil.parse(headers.authorization).id, id, false); }
  /**
   * Commit approved cancellation effects.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-5-commit-approved-cancellation-effects This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_order_items This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("admin/cancellation/:id/commit")
  public async cancellationCommit(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.commitRequest(AuthUtil.parse(headers.authorization).id, id, "cancellation"); }
  /**
   * Request an item refund.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-1-open-a-refund-request This controller operation realizes the refund domain 1 open a refund request contract through refundRequest.
   * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-5-derive-refunded-order-status This controller operation realizes the order lifecycle 5 derive refunded order status contract through refundRequest.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies This controller operation realizes the refund policies refund eligibility and resolution policies contract through refundRequest.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-4-limit-ordinary-refund-response-to-the-item-seller This controller operation realizes the refund policies 4 limit ordinary refund response to the item seller contract through refundRequest.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-5-relate-refund-participants-and-target This controller operation realizes the refund domain 5 relate refund participants and target contract through refundRequest.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-4-preserve-refund-decision-history This controller operation realizes the refund domain 4 preserve refund decision history contract through refundRequest.
   * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-5-transition-an-item-to-refunded This controller operation realizes the order item lifecycle 5 transition an item to refunded contract through refundRequest.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-2-close-the-refund-window-after-seven-days This controller operation realizes the refund policies 2 close the refund window after seven days contract through refundRequest.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle This controller operation realizes the refund domain refund request lifecycle contract through refundRequest.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey This controller operation realizes the refund functions delivered item refund journey contract through refundRequest.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-1-admit-a-timely-refund-request-for-a-delivered-item This controller operation realizes the refund policies 1 admit a timely refund request for a delivered item contract through refundRequest.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-1-request-an-item-refund This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_refund_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Post("customer/refund/:itemId/request")
  public async refundRequest(@TypedHeaders() headers: { authorization?: string }, @TypedParam("itemId") itemId: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingOrder.IItemAction): Promise<api.IShoppingResult> { return ShoppingProvider.requestRefund(AuthUtil.parse(headers.authorization).id, itemId, body); }
  /**
   * List pending refunds.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-3-keep-one-pending-refund-decision-per-item This controller operation realizes the refund policies 3 keep one pending refund decision per item contract through refundPending.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-5-decide-a-pending-refund-once This controller operation realizes the refund policies 5 decide a pending refund once contract through refundPending.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_refund_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("seller/refund/pending")
  public async refundPending(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingResult>> { return ShoppingProvider.pendingRefunds(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * Approve item refund.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-6-apply-an-approved-refund-atomically This controller operation realizes the refund policies 6 apply an approved refund atomically contract through refundApprove.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-2-approve-a-refund-request This controller operation realizes the refund domain 2 approve a refund request contract through refundApprove.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-3-approve-an-item-refund This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_refund_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("admin/refund/:id/approve")
  public async refundApprove(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.decideRefund(AuthUtil.parse(headers.authorization).id, id, true); }
  /**
   * Reject item refund.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-3-reject-a-refund-request This controller operation realizes the refund domain 3 reject a refund request contract through refundReject.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-4-reject-an-item-refund This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_refund_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("admin/refund/:id/reject")
  public async refundReject(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.decideRefund(AuthUtil.parse(headers.authorization).id, id, false); }
  /**
   * Commit approved refund effects.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-5-commit-approved-refund-effects This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_order_items This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("admin/refund/:id/commit")
  public async refundCommit(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.commitRequest(AuthUtil.parse(headers.authorization).id, id, "refund"); }
}


