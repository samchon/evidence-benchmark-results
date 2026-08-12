import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IPage, IShoppingCancellationRequest, IShoppingCustomer, IShoppingDashboard, IShoppingOrder, IShoppingRefundRequest, IShoppingSeller } from "@benchmark/shopping-api";

import { ShoppingSellerProvider } from "../providers/ShoppingSellerProvider";
import { ShoppingSellerSessionProvider } from "../providers/ShoppingSellerSessionProvider";
import { ShoppingAuthProvider } from "../providers/ShoppingAuthProvider";
import { ShoppingAfterSalesProvider } from "../providers/ShoppingAfterSalesProvider";
import { ShoppingSellerWorkflowProvider } from "../providers/ShoppingSellerWorkflowProvider";
import { ShoppingAuthorityProvider } from "../providers/ShoppingAuthorityProvider";
import { ShoppingAdminProvider } from "../providers/ShoppingAdminProvider";

/** Publishes seller profile, approval, fulfillment, and after-sales operations. */
@Controller("shopping/seller")
export class ShoppingSellerController {
  /** Read the acting seller profile.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Publishes the seller-profile model.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Reviewed seller ownership and public profile projection.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations Publishes the seller-profile operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations Reviewed own, edit, and public profile boundaries.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-1-define-seller-profile-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-1-define-seller-profile-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-2-relate-a-profile-to-its-seller This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-2-relate-a-profile-to-its-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-1-view-the-own-seller-profile This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-1-view-the-own-seller-profile Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_sellers This operation exposes the persisted model shopping_sellers.
 * @evidenceReview prisma:shopping_sellers Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_seller_profiles This operation exposes the persisted model shopping_seller_profiles.
 * @evidenceReview prisma:shopping_seller_profiles Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_seller_approval_requests This operation exposes the persisted model shopping_seller_approval_requests.
 * @evidenceReview prisma:shopping_seller_approval_requests Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_seller_profile_snapshots This operation exposes the persisted model shopping_seller_profile_snapshots.
 * @evidenceReview prisma:shopping_seller_profile_snapshots Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("profile/read")
  public async profile(@core.TypedHeaders() headers: IShoppingSeller.IHeaders): Promise<IShoppingSeller> { return ShoppingSellerProvider.at(await ShoppingSellerSessionProvider.seller(headers.Authorization)); }
  /** Edit the acting seller profile and create immutable evidence.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-4-preserve-the-purchase-time-shop-identity Preserves purchase-time seller identity separately from live profile edits.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-4-preserve-the-purchase-time-shop-identity Reviewed the provider's snapshot and order-item captured fields.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-2-edit-the-seller-profile Updates the acting seller profile.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-2-edit-the-seller-profile Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions Creates a profile revision.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("profile/update")
  public async profileUpdate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingSeller.IProfileUpdate): Promise<IShoppingSeller> { return ShoppingSellerProvider.update(await ShoppingSellerSessionProvider.seller(headers.Authorization), input); }
  /** Change the acting seller's password and revoke other sessions.
   * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Applies current-password credential policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Reviewed current-password proof and session revocation.
   * @tag Auth */
  @core.TypedRoute.Put("password/update")
  public async passwordUpdate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingSeller.IPasswordUpdate): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.sellerPassword(headers.Authorization, input); }
  /** Permanently close the acting seller after fulfillment and request blockers clear.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-7-retire-a-deleted-seller Retires the seller account.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-7-retire-a-deleted-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-4-block-seller-deletion-during-active-fulfillment Refuses closure during active fulfillment.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-4-block-seller-deletion-during-active-fulfillment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-5-block-seller-deletion-during-unresolved-requests Refuses closure during unresolved requests.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-5-block-seller-deletion-during-unresolved-requests Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Delete("account/erase")
  public async accountErase(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingSeller.IClose): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.sellerClose(headers.Authorization, input); }
  /** Read a public seller profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-3-view-a-public-seller-profile Reads a public seller profile.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-3-view-a-public-seller-profile Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("profile/public/:id")
  public async profileAt(@core.TypedParam("id") id: string): Promise<IShoppingSeller> { return ShoppingSellerProvider.at(id); }
  /** Read seller approval state.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-1-view-seller-approval-status Reads the seller approval state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-1-view-seller-approval-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("approval/status")
  public async approval(@core.TypedHeaders() headers: IShoppingSeller.IHeaders): Promise<IShoppingSeller> { return ShoppingSellerWorkflowProvider.approval(await ShoppingSellerSessionProvider.seller(headers.Authorization)); }
  /** Submit or resubmit seller approval.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Publishes seller approval, suspension, ban, and deletion state transitions.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Reviewed this approval transition with the separate restriction paths.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller Establishes the approved-seller lifecycle entry point.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller Reviewed approval state as the catalog authority prerequisite.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Publishes seller approval and restriction operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Reviewed submission, approval, rejection, suspension, and unsuspension routes.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-2-resubmit-seller-approval Submits or resubmits approval.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-2-resubmit-seller-approval Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-3-recover-from-seller-rejection Recovers from seller rejection.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-3-recover-from-seller-rejection Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason Retains the rejection reason when applicable.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("approval/submit")
  public async approvalCreate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingSeller.IApprovalCreate): Promise<IShoppingSeller> { return ShoppingSellerWorkflowProvider.approvalCreate(await ShoppingSellerSessionProvider.seller(headers.Authorization), input); }
  /** List pending seller approvals for administrators.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals Lists pending approvals.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts Lists seller accounts for governance.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("approval/pending")
  public async approvalIndex(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingSeller.IRequest): Promise<IPage<IShoppingSeller>> { const actor = await ShoppingAuthorityProvider.actor(headers.Authorization); await ShoppingAdminProvider.assertRegular(actor); return ShoppingSellerWorkflowProvider.approvalIndex(input); }
  /** Approve a seller registration.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller Enables approved seller operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller Reviewed approval state and downstream catalog guard.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration Approves a seller registration.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-1-require-approval-before-selling Requires approval before selling.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-1-require-approval-before-selling Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("approval/:id/approve")
  public async approvalApprove(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingSeller> { const actor = await ShoppingAuthorityProvider.actor(headers.Authorization); await ShoppingAdminProvider.assertRegular(actor); return ShoppingSellerWorkflowProvider.approvalDecide(actor.id, id, true); }
  /** Reject a seller registration.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration Rejects a seller registration.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason Stores the rejection reason.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("approval/:id/reject")
  public async approvalReject(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingSeller.IDecision): Promise<IShoppingSeller> { const actor = await ShoppingAuthorityProvider.actor(headers.Authorization); await ShoppingAdminProvider.assertRegular(actor); return ShoppingSellerWorkflowProvider.approvalDecide(actor.id, id, false, input.reason); }
  /** List paid items awaiting shipment for this seller.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations Publishes the shipping and delivery operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations Reviewed seller-scoped shipment listing, creation, tracking, and delivery routes.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies Applies shipment eligibility and delivery policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies Reviewed paid-item selection and package transition guards.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment Lists eligible paid items.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("shipment/items")
  public async shipmentItems(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingOrder.IRequest): Promise<IPage<IShoppingOrder.IItem>> { return ShoppingAfterSalesProvider.shipmentItems(await ShoppingSellerSessionProvider.seller(headers.Authorization), input); }
  /** Create a shipment for one seller's paid items.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model Publishes the shipment model.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model Reviewed seller ownership, package membership, and live delivery fields.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-1-define-shipment-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-1-define-shipment-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-2-relate-a-shipment-to-its-seller-and-items This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-2-relate-a-shipment-to-its-seller-and-items Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-3-permit-split-and-bundled-fulfillment This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-3-permit-split-and-bundled-fulfillment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-4-separate-shipments-by-seller This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-4-separate-shipments-by-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-2-create-a-shipment This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-2-create-a-shipment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-1-select-eligible-paid-items-for-shipment This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-1-select-eligible-paid-items-for-shipment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-2-keep-one-seller-and-destination-per-shipment This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-2-keep-one-seller-and-destination-per-shipment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-3-require-complete-shared-tracking-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-3-require-complete-shared-tracking-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-4-ship-all-package-items-together This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-4-ship-all-package-items-together Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_shipments This operation exposes the persisted model shopping_shipments.
 * @evidenceReview prisma:shopping_shipments Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_shipment_items This operation exposes the persisted model shopping_shipment_items.
 * @evidenceReview prisma:shopping_shipment_items Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shipment/create")
  public async shipmentCreate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingOrder.IShipmentCreate): Promise<IShoppingOrder.IShipment> { return ShoppingAfterSalesProvider.shipmentCreate(await ShoppingSellerSessionProvider.seller(headers.Authorization), input); }
  /** Read shipment tracking.
   * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-5-share-tracking-and-delivery-by-package Reads package tracking.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-5-share-tracking-and-delivery-by-package Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-3-view-shipment-tracking Reads shipment tracking.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-3-view-shipment-tracking Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("shipment/detail/:id")
  public async shipmentAt(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingOrder.IShipment> { const sellerId = await ShoppingSellerSessionProvider.seller(headers.Authorization); return ShoppingAfterSalesProvider.shipmentAt(id, sellerId); }
  /** Confirm delivery for a shipment.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-5-auto-confirm-shipment-delivery Applies the fourteen-day automatic confirmation before returning shipment state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-5-auto-confirm-shipment-delivery Reviewed the lazy scheduler transition and at-most-once item snapshots.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-6-complete-unconfirmed-shipments-after-fourteen-days Completes due unconfirmed shipments after fourteen days.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-6-complete-unconfirmed-shipments-after-fourteen-days Reviewed the due-date query, shipped-only item updates, and immutable delivery snapshots.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-4-confirm-shipment-delivery Confirms shipment delivery.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-4-confirm-shipment-delivery Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-5-confirm-delivery-for-the-whole-shipment Transitions every shipment item together.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-5-confirm-delivery-for-the-whole-shipment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("shipment/deliver/:id")
  public async shipmentDeliver(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingOrder.IShipment> { const sellerId = await ShoppingSellerSessionProvider.seller(headers.Authorization); return ShoppingAfterSalesProvider.shipmentDeliver(sellerId, id); }
  /** List pending cancellation requests for this seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations Lists pending seller decisions.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("cancellation/list")
  public async cancellationIndex(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingCancellationRequest.IRequest): Promise<IPage<IShoppingCancellationRequest>> { return ShoppingAfterSalesProvider.cancellationSellerIndex(await ShoppingSellerSessionProvider.seller(headers.Authorization), input); }
  /** Decide one cancellation request.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Completes the cancellation-request lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Reviewed the seller decision, immutable snapshot, and optional restoration movement.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Completes the seller side of the order-item cancellation journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Reviewed seller ownership and one-time decision behavior.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-2-approve-a-cancellation-request Decides a cancellation request.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-2-approve-a-cancellation-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-3-reject-a-cancellation-request Decides a cancellation request.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-3-reject-a-cancellation-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-4-preserve-cancellation-decision-history Records the decision snapshot.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-4-preserve-cancellation-decision-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-3-approve-item-cancellation Decides an item cancellation.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-3-approve-item-cancellation Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-4-reject-item-cancellation Decides an item cancellation.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-4-reject-item-cancellation Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-5-commit-approved-cancellation-effects Applies approved effects.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-5-commit-approved-cancellation-effects Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-3-limit-ordinary-cancellation-response-to-the-item-seller Restricts ordinary decisions to the item seller.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-3-limit-ordinary-cancellation-response-to-the-item-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-4-decide-a-pending-cancellation-once Allows one decision.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-4-decide-a-pending-cancellation-once Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-5-apply-an-approved-cancellation-atomically Commits approved effects atomically.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-5-apply-an-approved-cancellation-atomically Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence prisma:shopping_cancellation_snapshots Persists immutable cancellation decision evidence.
   * @evidenceReview prisma:shopping_cancellation_snapshots Read the decision provider transaction and confirmed the snapshot is created with the state transition.
   */
  @core.TypedRoute.Put("cancellation/decide/:id")
  public async cancellationDecide(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingCancellationRequest.IDecision): Promise<IShoppingCancellationRequest> { return ShoppingAfterSalesProvider.cancellationDecide(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
  /** List pending refund requests for this seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds Lists pending seller decisions.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("refund/list")
  public async refundIndex(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingRefundRequest.IRequest): Promise<IPage<IShoppingRefundRequest>> { return ShoppingAfterSalesProvider.refundSellerIndex(await ShoppingSellerSessionProvider.seller(headers.Authorization), input); }
  /** Decide one refund request.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Completes the refund-request lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Reviewed the seller decision, immutable snapshot, and optional restoration movement.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Completes the seller side of the delivered-item refund journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Reviewed seller ownership, deadline, and one-time decision behavior.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-2-approve-a-refund-request Decides a refund request.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-2-approve-a-refund-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-3-reject-a-refund-request Decides a refund request.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-3-reject-a-refund-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-refund-domain-4-preserve-refund-decision-history Records the decision snapshot.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-4-preserve-refund-decision-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-3-approve-an-item-refund Decides an item refund.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-3-approve-an-item-refund Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-4-reject-an-item-refund Decides an item refund.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-4-reject-an-item-refund Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-5-commit-approved-refund-effects Applies approved effects.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-5-commit-approved-refund-effects Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-4-limit-ordinary-refund-response-to-the-item-seller Restricts ordinary decisions to the item seller.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-4-limit-ordinary-refund-response-to-the-item-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-5-decide-a-pending-refund-once Allows one decision.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-5-decide-a-pending-refund-once Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-refund-policies-6-apply-an-approved-refund-atomically Commits approved effects atomically.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-6-apply-an-approved-refund-atomically Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence prisma:shopping_refund_snapshots Persists immutable refund decision evidence.
   * @evidenceReview prisma:shopping_refund_snapshots Read the decision provider transaction and confirmed the snapshot is created with the state transition.
   */
  @core.TypedRoute.Put("refund/decide/:id")
  public async refundDecide(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingRefundRequest.IDecision): Promise<IShoppingRefundRequest> { return ShoppingAfterSalesProvider.refundDecide(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
  /** Read the seller dashboard at one observation time.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Publishes the seller dashboard and order-item report family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Reviewed summary counts and seller-scoped order-item reporting.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies Applies dashboard calculation policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies Reviewed the common observation time and retained seller attribution.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-1-view-the-shop-summary This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-dashboard-1-view-the-shop-summary Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-3-count-unresolved-seller-requests This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-3-count-unresolved-seller-requests Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("dashboard/summary")
  public async dashboard(@core.TypedHeaders() headers: IShoppingSeller.IHeaders): Promise<IShoppingDashboard> { const sellerId = await ShoppingSellerSessionProvider.seller(headers.Authorization); return ShoppingSellerProvider.dashboard(sellerId); }
  /** List retained seller-attributed order items.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-2-list-shop-order-items Publishes seller order-item reporting.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-dashboard-2-list-shop-order-items Reviewed seller scope, exact status filtering, and pagination.
   * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-2-count-all-retained-seller-order-items Counts retained seller-attributed order items.
   * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-2-count-all-retained-seller-order-items Reviewed purchase-time seller attribution and product-retirement continuity.
   * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-4-filter-seller-order-items-by-one-exact-status Applies the exact one-status filter.
   * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-4-filter-seller-order-items-by-one-exact-status Reviewed allowed status values, ordering, and seller scope.
   * @tag Dashboard */
  @core.TypedRoute.Patch("dashboard/order-item")
  public async dashboardItems(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingDashboard.IRequest): Promise<IPage<IShoppingOrder.IItem>> { return ShoppingSellerProvider.dashboardItems(await ShoppingSellerSessionProvider.seller(headers.Authorization), input); }
}
