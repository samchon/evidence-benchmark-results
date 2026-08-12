import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IPage, IShoppingAdministratorRequest, IShoppingCategory, IShoppingCustomer, IShoppingOrder, IShoppingProduct, IShoppingSeller } from "@benchmark/shopping-api";
import { ShoppingAuthorityProvider } from "../providers/ShoppingAuthorityProvider";
import { ShoppingAdminProvider } from "../providers/ShoppingAdminProvider";
import { ShoppingOrderProvider } from "../providers/ShoppingOrderProvider";
import { ShoppingCatalogProvider } from "../providers/ShoppingCatalogProvider";

/** Publishes regular and super administrator governance and oversight operations. */
@Controller("shopping/admin")
export class ShoppingAdminController {
  /** Submit an administrator application as an existing identity.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle Publishes the administrator-request lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle Reviewed request creation, decision ownership, and retained history routes.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations Publishes the administrator-application operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations Reviewed the request create, list, and decision routes as one public lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-1-open-an-administrator-request This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-1-open-an-administrator-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-1-admit-an-administrator-application This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-1-admit-an-administrator-application Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-2-keep-one-pending-application-per-identity This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-2-keep-one-pending-application-per-identity Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_administrator_requests This operation exposes the persisted model shopping_administrator_requests.
 * @evidenceReview prisma:shopping_administrator_requests Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("request/create")
  public async requestCreate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingAdministratorRequest.ICreate): Promise<IShoppingAdministratorRequest> { return ShoppingAdminProvider.requestCreate(await ShoppingAuthorityProvider.actor(headers.Authorization), input); }
  /** List personal administrator applications.
   * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-4-retain-administrator-request-history Reads retained application history for the acting identity.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-4-retain-administrator-request-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history Lists the acting identity's administrator applications.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("request/list")
  public async requestIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingAdministratorRequest.IRequest): Promise<IPage<IShoppingAdministratorRequest>> { return ShoppingAdminProvider.requestIndex(await ShoppingAuthorityProvider.actor(headers.Authorization), input); }
  /** List pending administrator applications platform-wide.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications Lists pending applications for governance review.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Enforces the super-administrator-only pending queue.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("request/pending")
  public async requestPending(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingAdministratorRequest.IRequest): Promise<IPage<IShoppingAdministratorRequest>> { return ShoppingAdminProvider.requestPending(await ShoppingAuthorityProvider.actor(headers.Authorization), input); }
  /** Approve an administrator application and grant regular authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Publishes administrator grade authority.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Reviewed the super-only decision and regular-grade grant.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-1-regular-administrator-authority Grants the regular administrator authority defined by approval.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-1-regular-administrator-authority Reviewed the provider's regularAdministrator grade creation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-3-grant-regular-administrator-authority Grants regular authority to the existing applicant identity.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-3-grant-regular-administrator-authority Reviewed the atomic request decision and grade creation.
   * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-2-approve-an-administrator-request Records an approval decision.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-2-approve-an-administrator-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application Approves an administrator application.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Enforces the super-administrator-only decision.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-4-grant-the-regular-administrator-grade-on-approval Grants regular authority on approval.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-4-grant-the-regular-administrator-grade-on-approval Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("request/:id/approve")
  public async requestApprove(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingAdministratorRequest> { return ShoppingAdminProvider.requestDecide(await ShoppingAuthorityProvider.actor(headers.Authorization), id, { approve: true }); }
  /** Reject an administrator application.
   * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-3-reject-an-administrator-request Records a rejection decision.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-3-reject-an-administrator-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application Rejects an administrator application.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Enforces the super-administrator-only decision.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("request/:id/reject")
  public async requestReject(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingAdministratorRequest.IDecision): Promise<IShoppingAdministratorRequest> { return ShoppingAdminProvider.requestDecide(await ShoppingAuthorityProvider.actor(headers.Authorization), id, input); }
  /** Promote a regular administrator to super administrator.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations Publishes the administrator-grade change operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations Reviewed the guarded promotion and demotion routes.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-4-promote-an-administrator This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-4-promote-an-administrator Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_administrator_grades This operation exposes the persisted model shopping_administrator_grades.
 * @evidenceReview prisma:shopping_administrator_grades Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_administrator_grade_events This operation exposes the persisted model shopping_administrator_grade_events.
 * @evidenceReview prisma:shopping_administrator_grade_events Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("grade/:id/promote")
  public async gradePromote(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer | IShoppingSeller> { return ShoppingAdminProvider.gradePromote(await ShoppingAuthorityProvider.actor(headers.Authorization), id); }
  /** Demote another super administrator while retaining regular authority.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority Requires super-administrator authority.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-5-demote-another-super-administrator Demotes another super administrator.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-5-demote-another-super-administrator Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-6-prevent-self-demotion Rejects self-demotion.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-6-prevent-self-demotion Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator Performs the demotion operation.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("grade/:id/demote")
  public async gradeDemote(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer | IShoppingSeller> { return ShoppingAdminProvider.gradeDemote(await ShoppingAuthorityProvider.actor(headers.Authorization), id); }
  /** List customer accounts for oversight.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Publishes customer and seller account oversight.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Reviewed the regular-administrator account list and moderation routes.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Covers the application and grade governance boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Reviewed this operation with the request and grade guards.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight This operation is an administrator oversight boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Reviewed the authority guard and complete account projection.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Provides the administrator's platform-wide inspection boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Reviewed the regular-administrator guard and retained account records.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts Lists customer accounts for platform oversight.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("customer")
  public async customerIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCustomer.IRequest): Promise<IPage<IShoppingCustomer.ISummary>> { return ShoppingAdminProvider.customerIndex(await ShoppingAuthorityProvider.actor(headers.Authorization), input); }
  /** Ban a customer and revoke all sessions.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer Bans a customer account.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Suspends access without deleting history.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("customer/:id/ban")
  public async customerBan(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer> { return ShoppingAdminProvider.customerBan(await ShoppingAuthorityProvider.actor(headers.Authorization), id); }
  /** Unban a customer.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer Restores customer access.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("customer/:id/unban")
  public async customerUnban(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer> { return ShoppingAdminProvider.customerUnban(await ShoppingAuthorityProvider.actor(headers.Authorization), id); }
  /** List seller accounts for oversight.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity Keeps seller-owned activity behind seller authority while exposing it to administrators.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity Reviewed the administrator guard and seller-scoped projection.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Provides platform-wide seller oversight.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Reviewed the authority guard and retained seller state.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Provides administrator seller oversight.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Reviewed the regular-administrator guard and seller-state projection.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts Lists seller accounts.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("seller")
  public async sellerIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingSeller.IRequest): Promise<IPage<IShoppingSeller.ISummary>> { return ShoppingAdminProvider.sellerIndex(await ShoppingAuthorityProvider.actor(headers.Authorization), input); }
  /** Ban a seller and revoke all sessions.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller Bans a seller account.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Suspends access without deleting history.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("seller/:id/ban")
  public async sellerBan(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingSeller> { return ShoppingAdminProvider.sellerBan(await ShoppingAuthorityProvider.actor(headers.Authorization), id); }
  /** Unban a seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller Restores seller access.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("seller/:id/unban")
  public async sellerUnban(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingSeller> { return ShoppingAdminProvider.sellerUnban(await ShoppingAuthorityProvider.actor(headers.Authorization), id); }
  /** Suspend an approved seller while preserving fulfillment duties.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller Suspends catalog authority while retaining seller duties.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller Read the suspension provider transaction and confirmed it changes only suspension state and moderation evidence.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-3-separate-suspension-from-fulfillment-duties Keeps suspension independent from authentication and fulfillment.
   * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-3-separate-suspension-from-fulfillment-duties Compared the seller state guard with catalog and fulfillment guards.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently Records seller moderation state without changing login state.
   * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently Checked the provider updates suspended_at only and writes an attributed moderation event.
   * @evidence prisma:shopping_moderation_events Records the suspension decision evidence.
   * @evidenceReview prisma:shopping_moderation_events Read the transaction and confirmed the event is created with before and after states.
   */
  @core.TypedRoute.Put("seller/:id/suspend")
  public async sellerSuspend(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingSeller> { return ShoppingAdminProvider.sellerSuspend(await ShoppingAuthorityProvider.actor(headers.Authorization), id); }
  /** Clear a seller suspension while preserving approval and history.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller Restores catalog eligibility subject to the remaining seller state.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller Read the unsuspension provider transaction and confirmed it clears only suspended_at and records moderation evidence.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently Leaves approval and login state independent from suspension.
   * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently Checked the provider's state guard and target-state update.
   * @evidence prisma:shopping_moderation_events Records the unsuspension decision evidence.
   * @evidenceReview prisma:shopping_moderation_events Read the transaction and confirmed the event is created with before and after states.
   */
  @core.TypedRoute.Put("seller/:id/unsuspend")
  public async sellerUnsuspend(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingSeller> { return ShoppingAdminProvider.sellerUnsuspend(await ShoppingAuthorityProvider.actor(headers.Authorization), id); }
  /** List all retained platform orders.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Covers administrator order oversight.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Reviewed the complete list/detail and force-resolution routes.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-1-list-platform-orders Lists retained platform orders.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-1-list-platform-orders Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("order/list")
  public async orderIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingOrder.IRequest): Promise<IPage<IShoppingOrder>> { await ShoppingAdminProvider.assertRegular(await ShoppingAuthorityProvider.actor(headers.Authorization)); return ShoppingOrderProvider.adminIndex(input); }
  /** Read one order for platform oversight.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order Reads a complete platform order.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-1-inspect-the-complete-platform-record Returns the retained platform record without mutating it.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-1-inspect-the-complete-platform-record Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable Presents purchase-time order facts.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("order/detail/:id")
  public async orderAt(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingOrder> { await ShoppingAdminProvider.assertRegular(await ShoppingAuthorityProvider.actor(headers.Authorization)); return ShoppingOrderProvider.adminAt(id); }
  /** Force-cancel one eligible order item.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item Applies one administrator force cancellation.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item Reviewed the item eligibility check, transition, restoration movement, and retained snapshot.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Provides the administrator order-oversight operation.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Reviewed the regular-administrator guard and order-scoped effect.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-5-force-cancel-an-eligible-order-item Applies the eligible-item force-cancellation policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-5-force-cancel-an-eligible-order-item Reviewed the item-state guard, snapshot, and inventory restoration transaction.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Owns the administrator force-resolution boundary.
   * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Reviewed the administrator guard and attributed reason.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-3-keep-each-commercial-reversal-synchronized Keeps the forced state, evidence, and stock effect synchronized.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-3-keep-each-commercial-reversal-synchronized Reviewed the provider transaction and exact item quantity.
   * @tag ForceResolution */
  @core.TypedRoute.Put("order-item/:id/cancel")
  public async forceCancelItem(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingOrder.IReason): Promise<IShoppingOrder> { const actor = await ShoppingAuthorityProvider.actor(headers.Authorization); await ShoppingAdminProvider.assertRegular(actor); return ShoppingOrderProvider.forceItem(id, "cancelled", input.reason, actor.id); }
  /** Force-cancel every eligible item in an order.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items Applies the force cancellation to every eligible item only.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items Reviewed the complete eligible-set selection and unchanged ineligible items.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-7-apply-a-force-action-across-an-orders-eligible-items Applies one atomic order-scoped eligible-set transition.
   * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-7-apply-a-force-action-across-an-orders-eligible-items Reviewed the provider transaction over the selected order items.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-4-preserve-independent-item-progress Preserves unrelated item progress while resolving eligible lines.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-4-preserve-independent-item-progress Reviewed the item-scoped updates and derived order projection.
   * @tag ForceResolution */
  @core.TypedRoute.Put("order/:id/cancel")
  public async forceCancelOrder(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingOrder.IReason): Promise<IShoppingOrder> { const actor = await ShoppingAuthorityProvider.actor(headers.Authorization); await ShoppingAdminProvider.assertRegular(actor); return ShoppingOrderProvider.forceOrder(id, "cancelled", input.reason, actor.id); }
  /** Force-refund one eligible order item.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item Applies one administrator force refund.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item Reviewed the item eligibility check, transition, restoration movement, and retained snapshot.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-6-force-refund-an-eligible-order-item Applies the eligible-item force-refund policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-6-force-refund-an-eligible-order-item Reviewed the item-state guard, snapshot, and inventory restoration transaction.
   * @tag ForceResolution */
  @core.TypedRoute.Put("order-item/:id/refund")
  public async forceRefundItem(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingOrder.IReason): Promise<IShoppingOrder> { const actor = await ShoppingAuthorityProvider.actor(headers.Authorization); await ShoppingAdminProvider.assertRegular(actor); return ShoppingOrderProvider.forceItem(id, "refunded", input.reason, actor.id); }
  /** Force-refund every eligible item in an order.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items Applies the force refund to every eligible item only.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items Reviewed the complete eligible-set selection and unchanged ineligible items.
   * @tag ForceResolution */
  @core.TypedRoute.Put("order/:id/refund")
  public async forceRefundOrder(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingOrder.IReason): Promise<IShoppingOrder> { const actor = await ShoppingAuthorityProvider.actor(headers.Authorization); await ShoppingAdminProvider.assertRegular(actor); return ShoppingOrderProvider.forceOrder(id, "refunded", input.reason, actor.id); }
  /** Retire a policy-violating product and preserve its history.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Covers administrator product inspection and retirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Reviewed the administrator guard and provider delegation.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders Retires live merchandise while retaining order evidence.
   * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders Reviewed the product snapshot, moderation event, and non-rewriting order path.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Applies the product retirement policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Reviewed the nonempty reason and terminal live-state transition.
   * @tag Oversight */
  @core.TypedRoute.Put("product/:id/delete")
  public async productDelete(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingProduct.IDelete): Promise<IShoppingProduct> { const actor = await ShoppingAuthorityProvider.actor(headers.Authorization); await ShoppingAdminProvider.assertRegular(actor); return ShoppingCatalogProvider.adminProductDelete(id, input.reason, actor.id); }
  /** Browse products across seller ownership boundaries.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Covers administrator product listing and inspection.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Reviewed the regular-administrator guard and provider projection.
   * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Provides the platform-wide product oversight boundary.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Reviewed the administrator authority guard and retained catalog scope.
   * @tag Oversight */
  @core.TypedRoute.Patch("product/list")
  public async productIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> { await ShoppingAdminProvider.assertRegular(await ShoppingAuthorityProvider.actor(headers.Authorization)); return ShoppingCatalogProvider.adminProductIndex(input); }
  /** Browse categories for curation.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Covers administrator category curation and listing.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Reviewed the regular-administrator guard and category provider.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Applies administrator category curation policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Reviewed the guarded taxonomy projection.
   * @tag Oversight */
  @core.TypedRoute.Patch("category/list")
  public async categoryIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCategory.IRequest): Promise<IPage<IShoppingCategory>> { await ShoppingAdminProvider.assertRegular(await ShoppingAuthorityProvider.actor(headers.Authorization)); return ShoppingCatalogProvider.categoryIndex(input); }
}
