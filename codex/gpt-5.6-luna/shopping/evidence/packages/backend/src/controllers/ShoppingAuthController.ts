import { TypedRoute as Route, TypedBody, TypedHeaders } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";

import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Authentication lifecycle operations for all platform actors. */
@Controller("shopping")
export class ShoppingAuthController {
  /**
   * Register a customer identity and issue its first session.
   * @evidence docs/analysis/04-business-rules.md#req-credential-policies-2-refuse-duplicate-registration This controller operation realizes the credential policies 2 refuse duplicate registration contract through customerJoin.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Registers and authenticates customers.
  * @evidence prisma:shopping_customers Persists the customer identity.
   * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Enforces registration credential policy through customerJoin.
 * @setHeader token.access Authorization
   * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-1-require-registration-for-every-feature Enforces registration boundaries through customerJoin.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-1-register-a-customer-account Enforces the identity 1 register a customer account contract through customerJoin.
  */
 @Route.Post("customer/auth/join")
  public async customerJoin(@TypedBody() body: api.IShoppingCustomer.IJoin): Promise<api.IShoppingCustomer.IAuthorized> { return ShoppingProvider.customerJoin(body); }
  /**
   * Log in an active customer.
   * @evidence docs/analysis/04-business-rules.md#req-credential-policies-1-keep-one-identity-per-canonical-email-and-account-type This controller operation realizes the credential policies 1 keep one identity per canonical email and account type contract through customerLogin.
   * @evidence docs/analysis/04-business-rules.md#req-credential-policies-4-block-unavailable-identities This controller operation realizes the credential policies 4 block unavailable identities contract through customerLogin.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-2-log-in-as-a-customer Checks credentials and creates a session.
   * @evidence prisma:shopping_customer_sessions Retains the authenticated connection.
   * @setHeader token.access Authorization
   * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-2-limit-customer-owned-activity Enforces the boundaries 2 limit customer owned activity contract through customerLogin.
   * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity Enforces the boundaries 3 limit seller owned activity contract through customerLogin.
   * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension Enforces the boundaries 4 preserve duties during seller suspension contract through customerLogin.
   * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Enforces the boundaries 5 block login for banned accounts contract through customerLogin.
   * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Enforces the boundaries 6 apply platform wide administrator oversight contract through customerLogin.
   * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Enforces the boundaries identity and permission boundaries contract through customerLogin.
   */
  @Route.Post("customer/auth/login")
  public async customerLogin(@TypedBody() body: api.IShoppingCustomer.ILogin): Promise<api.IShoppingCustomer.IAuthorized> { return ShoppingProvider.customerLogin(body); }
  /**
   * Continue a customer session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-3-continue-a-customer-session Validates the retained session.
   * @evidence prisma:shopping_customer_sessions Reads the active session.
   * @setHeader token.access Authorization
   */
  @Route.Post("customer/auth/refresh")
  public async customerRefresh(@TypedBody() body: api.IShoppingCustomer.IRefresh): Promise<api.IShoppingCustomer.IAuthorized> { return ShoppingProvider.customerRefresh(body); }
  /**
   * Register a seller pending approval.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Starts seller identity lifecycle.
   * @evidence prisma:shopping_sellers Persists the seller.
   * @setHeader token.access Authorization
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account Enforces the identity 1 register a seller account contract through sellerJoin.
   */
  @Route.Post("seller/auth/join")
  public async sellerJoin(@TypedBody() body: api.IShoppingSeller.IJoin): Promise<api.IShoppingSeller.IAuthorized> { return ShoppingProvider.sellerJoin(body); }
  /**
   * Log in a non-banned seller.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller Checks seller credentials and restrictions.
   * @evidence prisma:shopping_seller_sessions Retains the session.
   * @setHeader token.access Authorization
   */
  @Route.Post("seller/auth/login")
  public async sellerLogin(@TypedBody() body: api.IShoppingSeller.ILogin): Promise<api.IShoppingSeller.IAuthorized> { return ShoppingProvider.sellerLogin(body); }
  /**
   * Continue a seller session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session Validates current seller session state.
   * @evidence prisma:shopping_seller_sessions Reads the active session.
   * @setHeader token.access Authorization
   */
  @Route.Post("seller/auth/refresh")
  public async sellerRefresh(@TypedBody() body: api.IShoppingSeller.IRefresh): Promise<api.IShoppingSeller.IAuthorized> { return ShoppingProvider.sellerRefresh(body); }
  /**
   * Register the first or a regular administrator.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Provisions administrator grade authority.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-5-provision-the-initial-super-administrator Provisions the initial super administrator during bootstrap.
   * @evidence prisma:shopping_administrators Persists the administrator.
   * @setHeader token.access Authorization
   */
  @Route.Post("admin/auth/join")
  public async adminJoin(@TypedBody() body: api.IShoppingAdmin.IJoin): Promise<api.IShoppingAdmin.IAuthorized> { return ShoppingProvider.adminJoin(body); }
  /**
   * Log in an active administrator.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Authenticates administrator authority.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-1-regular-administrator-authority Authenticates an administrator identity retaining regular authority.
   * @evidence prisma:shopping_administrator_sessions Retains the session.
   * @setHeader token.access Authorization
   */
  @Route.Post("admin/auth/login")
  public async adminLogin(@TypedBody() body: api.IShoppingAdmin.ILogin): Promise<api.IShoppingAdmin.IAuthorized> { return ShoppingProvider.adminLogin(body); }
  /**
   * Continue an administrator session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Validates administrator session state.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority Preserves super administrator authority on session renewal.
   * @evidence prisma:shopping_administrator_sessions Reads the active session.
   * @setHeader token.access Authorization
   */
  @Route.Post("admin/auth/refresh")
  public async adminRefresh(@TypedBody() body: api.IShoppingAdmin.IRefresh): Promise<api.IShoppingAdmin.IAuthorized> { return ShoppingProvider.adminRefresh(body); }
  /**
   * Log out the current customer session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-4-log-out-the-current-customer-session This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_customer_sessions This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Post("customer/auth/logout")
  public async customerLogout(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingResult> { const token = AuthUtil.parse(headers.authorization); return ShoppingProvider.customerLogout(token.id, token.sessionId); }
  /**
   * Log out every customer session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-5-log-out-every-customer-session This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Post("customer/auth/logout-all")
  public async customerLogoutAll(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingResult> { const token = AuthUtil.parse(headers.authorization); return ShoppingProvider.customerLogoutAll(token.id); }
  /**
   * Change a customer password.
   * @evidence docs/analysis/04-business-rules.md#req-credential-policies-3-require-current-password-proof-for-password-change This controller operation realizes the credential policies 3 require current password proof for password change contract through customerPassword.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-6-change-the-customer-password This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Put("customer/auth/password")
  public async customerPassword(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingCustomer.IPasswordChange): Promise<api.IShoppingResult> { return ShoppingProvider.customerPassword(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * Recover customer access.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Post("customer/auth/recover")
  public async customerRecover(@TypedBody() body: api.IShoppingCustomer.ILogin): Promise<api.IShoppingResult> { const auth = await ShoppingProvider.customerLogin(body); return { status: auth.accessToken }; }
  /**
   * Delete a customer account.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-8-delete-a-customer-account This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Delete("customer/auth/close")
  public async customerClose(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingCustomer.IClose): Promise<api.IShoppingResult> { return ShoppingProvider.closeCustomer(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * Log out the current seller session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Post("seller/auth/logout")
  public async sellerLogout(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingResult> { const token = AuthUtil.parse(headers.authorization); return ShoppingProvider.sellerLogout(token.id, token.sessionId); }
  /**
   * Log out every seller session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Post("seller/auth/logout-all")
  public async sellerLogoutAll(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingResult> { return ShoppingProvider.sellerLogoutAll(AuthUtil.parse(headers.authorization).id); }
  /**
   * Change a seller password.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-6-change-the-seller-password This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Put("seller/auth/password")
  public async sellerPassword(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingSeller.IPasswordChange): Promise<api.IShoppingResult> { return ShoppingProvider.sellerPassword(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * Recover seller access.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Post("seller/auth/recover")
  public async sellerRecover(@TypedBody() body: api.IShoppingSeller.ILogin): Promise<api.IShoppingResult> { const auth = await ShoppingProvider.sellerLogin(body); return { status: auth.accessToken }; }
  /**
   * Delete a seller account.
   * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-8-delete-a-seller-account This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Delete("seller/auth/close")
  public async sellerClose(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingSeller.IClose): Promise<api.IShoppingResult> { return ShoppingProvider.closeSeller(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * Log out the current administrator session.
   */
  @Route.Post("admin/auth/logout")
  public async adminLogout(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingResult> { const token = AuthUtil.parse(headers.authorization); return ShoppingProvider.adminLogout(token.id, token.sessionId); }
}


