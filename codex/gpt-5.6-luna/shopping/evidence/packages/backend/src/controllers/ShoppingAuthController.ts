import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IShoppingCustomer, IShoppingSeller } from "@benchmark/shopping-api";

import { ShoppingAuthProvider } from "../providers/ShoppingAuthProvider";

/** Publishes customer and seller credential lifecycle operations. */
@Controller()
export class ShoppingAuthController {
  /** Register a customer and issue its first session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Publishes the identity boundary for customer registration and session issuance.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Reviewed canonical registration, identity type, and issued session ownership.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Applies the registration and credential policy family.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Reviewed canonical email collision and credential initialization.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Establishes the customer credential lifecycle.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-1-register-a-customer-account This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-1-register-a-customer-account Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_customer_sessions This operation exposes the persisted model shopping_customer_sessions.
 * @evidenceReview prisma:shopping_customer_sessions Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/customer/join")
  public async customerJoin(@core.TypedBody() input: IShoppingCustomer.IJoin): Promise<IShoppingCustomer.IAuthorized> { return ShoppingAuthProvider.customerJoin(input); }
  /** Log in an eligible customer.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Blocks banned customer login and unusable sessions.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Reviewed login eligibility and the live-session actor check.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-2-log-in-as-a-customer Authenticates an eligible customer.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-2-log-in-as-a-customer Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/customer/login")
  public async customerLogin(@core.TypedBody() input: IShoppingCustomer.ILogin): Promise<IShoppingCustomer.IAuthorized> { return ShoppingAuthProvider.customerLogin(input); }
  /** Continue a customer session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-3-continue-a-customer-session Refreshes an eligible customer session.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-3-continue-a-customer-session Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/customer/refresh")
  public async customerRefresh(@core.TypedBody() input: IShoppingCustomer.IRefresh): Promise<IShoppingCustomer.IAuthorized> { return ShoppingAuthProvider.customerRefresh(input); }
  /** End the current customer session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-4-log-out-the-current-customer-session Revokes the current customer session.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-4-log-out-the-current-customer-session Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/customer/logout")
  public async customerLogout(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.customerLogout(headers.Authorization, false); }
  /** Revoke every customer session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-5-log-out-every-customer-session Revokes all customer sessions.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-5-log-out-every-customer-session Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/customer/logout-all")
  public async customerLogoutAll(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.customerLogout(headers.Authorization, true); }
  /** Register a seller in pending approval state and issue its first session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Publishes seller identity and permission separation.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Reviewed pending registration and non-selling initial state.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Publishes the seller account state lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Reviewed pending approval, login, suspension, and deletion fields.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-1-begin-seller-approval-as-pending Establishes pending seller approval.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-1-begin-seller-approval-as-pending Reviewed the registration provider's pending state.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Publishes seller approval and restriction lifecycle entry.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Reviewed seller registration as the first lifecycle operation.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Applies seller registration credential policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Reviewed canonical email collision and initial credential/session issuance.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Establishes the seller credential lifecycle.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account Creates a pending seller and its first session.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence prisma:shopping_seller_sessions This operation exposes the persisted seller session model.
 * @evidenceReview prisma:shopping_seller_sessions Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/seller/join")
  public async sellerJoin(@core.TypedBody() input: IShoppingSeller.IJoin): Promise<IShoppingSeller.IAuthorized> { return ShoppingAuthProvider.sellerJoin(input); }
  /** Log in an eligible seller.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension Allows suspended sellers to authenticate for retained duties.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension Reviewed that suspension is distinct from login state.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Blocks banned seller login.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Reviewed login state and deleted-account guards.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller Authenticates an eligible seller.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/seller/login")
  public async sellerLogin(@core.TypedBody() input: IShoppingSeller.ILogin): Promise<IShoppingSeller.IAuthorized> { return ShoppingAuthProvider.sellerLogin(input); }
  /** Continue a seller session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session Refreshes an eligible seller session.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/seller/refresh")
  public async sellerRefresh(@core.TypedBody() input: IShoppingSeller.IRefresh): Promise<IShoppingSeller.IAuthorized> { return ShoppingAuthProvider.sellerRefresh(input); }
  /** Request a seller recovery challenge recorded at the delivery boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Records the seller ownership challenge without returning its secret.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/seller/recover/request")
  public async sellerRecover(@core.TypedBody() input: IShoppingSeller.IRecover): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.sellerRecover(input); }
  /** Complete seller recovery from a delivered challenge.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Completes seller access recovery from a delivered challenge.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("shopping/auth/seller/recover/complete")
  public async sellerRecoverComplete(@core.TypedBody() input: IShoppingSeller.IRecoverComplete): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.sellerRecoverComplete(input); }
  /** End the current seller session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session Revokes the current seller session.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/seller/logout")
  public async sellerLogout(@core.TypedHeaders() headers: IShoppingSeller.IHeaders): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.sellerLogout(headers.Authorization, false); }
  /** Revoke every seller session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session Revokes all seller sessions.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("shopping/auth/seller/logout-all")
  public async sellerLogoutAll(@core.TypedHeaders() headers: IShoppingSeller.IHeaders): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.sellerLogout(headers.Authorization, true); }
}
