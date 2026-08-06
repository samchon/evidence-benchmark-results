import { TypedBody, TypedHeaders, TypedParam, TypedRoute as Route } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";
import type { tags } from "typia";
import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Administrator applications, grades, account oversight, and order resolution. */
@Controller("shopping/admin")
export class ShoppingAdminGovernanceController {
  /**
   * Submit an administrator application.
   * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle This controller operation realizes the admin request domain administrator request lifecycle contract through requestCreate.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations This controller operation realizes the admin request functions administrator application operations contract through requestCreate.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_administrator_requests This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-1-open-an-administrator-request Enforces the request domain 1 open an administrator request contract through requestCreate.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Applies the administrator application and grade workflow.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-1-admit-an-administrator-application Admits a valid application for the acting identity.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-2-keep-one-pending-application-per-identity Rejects a duplicate pending application for the same identity.
   */
  @Route.Post("request/create")
  public async requestCreate(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingAdmin.IRequest): Promise<api.IShoppingAdmin.IApplication> { return ShoppingProvider.submitAdminApplication(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * View personal application history.
   * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-4-retain-administrator-request-history This controller operation realizes the admin request domain 4 retain administrator request history contract through requestMine.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_administrator_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Get("request/mine")
  public async requestMine(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingAdmin.IApplication[]> { return ShoppingProvider.adminApplications(AuthUtil.parse(headers.authorization).id); }
  /**
   * List pending administrator applications.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_administrator_requests This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("request/pending")
  public async requestPending(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingAdmin.IApplication>> { return ShoppingProvider.pendingAdminApplications(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * Approve an administrator application.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-2-approve-an-administrator-request Enforces the request domain 2 approve an administrator request contract through requestApprove.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Restricts application decisions to super administrators.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-4-grant-the-regular-administrator-grade-on-approval Grants only regular authority when approval commits.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-3-grant-regular-administrator-authority Grants regular authority to the approved identity.
   */
  @Route.Put("request/:id/approve")
  public async requestApprove(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.decideAdminApplication(AuthUtil.parse(headers.authorization).id, id, true); }
  /**
   * Reject an administrator application.
   * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-3-reject-an-administrator-request This controller operation realizes the admin request domain 3 reject an administrator request contract through requestReject.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Put("request/:id/reject")
  public async requestReject(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingAdmin.IRequest): Promise<api.IShoppingResult> { return ShoppingProvider.decideAdminApplication(AuthUtil.parse(headers.authorization).id, id, false, body); }
  /**
   * Promote a regular administrator.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations This controller operation realizes the admin grade functions administrator grade change operations contract through promote.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_administrators This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-4-promote-an-administrator Enforces the authority 4 promote an administrator contract through promote.
   */
  @Route.Put("grade-promote/:id")
  public async promote(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.changeAdminGrade(AuthUtil.parse(headers.authorization).id, id, "super"); }
  /**
   * Demote another super administrator.
   * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-5-demote-another-super-administrator Enforces the authority 5 demote another super administrator contract through demote.
   * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-7-refuse-super-administrator-self-demotion Refuses a super administrator's self-demotion.
   * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-6-prevent-self-demotion Refuses self-demotion without changing grades.
   */
  @Route.Put("grade-demote/:id")
  public async demote(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.changeAdminGrade(AuthUtil.parse(headers.authorization).id, id, "regular"); }
  /**
   * List customer accounts.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight This controller operation realizes the user oversight customer and seller account oversight contract through customers.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_customers This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-1-inspect-the-complete-platform-record Inspects customer records across ownership boundaries.
   */
  @Route.Patch("customer-accounts")
  public async customers(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IShoppingAdmin.IPageRequest): Promise<api.IPage<api.IShoppingCustomer>> { return ShoppingProvider.listCustomers(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * Ban a customer.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Bans login while retaining customer history.
   */
  @Route.Put("user/customer/:id/ban")
  public async banCustomer(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.setAccountBan(AuthUtil.parse(headers.authorization).id, id, "customer", true); }
  /**
   * Unban a customer.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Put("user/customer/:id/unban")
  public async unbanCustomer(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.setAccountBan(AuthUtil.parse(headers.authorization).id, id, "customer", false); }
  /**
   * List seller accounts.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_sellers This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-1-inspect-the-complete-platform-record Inspects seller records across ownership boundaries.
   */
  @Route.Patch("seller-accounts")
  public async sellers(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IShoppingAdmin.IPageRequest): Promise<api.IPage<api.IShoppingSeller>> { return ShoppingProvider.listSellers(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * Ban a seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Bans seller login while retaining history.
   */
  @Route.Put("user/seller/:id/ban")
  public async banSeller(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.setAccountBan(AuthUtil.parse(headers.authorization).id, id, "seller", true); }
  /**
   * Unban a seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Put("user/seller/:id/unban")
  public async unbanSeller(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.setAccountBan(AuthUtil.parse(headers.authorization).id, id, "seller", false); }
  /**
   * List platform orders.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-1-list-platform-orders This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_orders This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("order/list")
  public async orders(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IShoppingOrder.IRequest): Promise<api.IPage<api.IShoppingOrder>> { return ShoppingProvider.platformOrders(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * View a platform order.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Get("order/:id/detail")
  public async order(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingOrder> { return ShoppingProvider.platformOrder(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Force-cancel one order item.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-5-force-cancel-an-eligible-order-item Applies a force-cancel action to one eligible order item.
   */
  @Route.Put("order/item/:id/cancel")
  public async cancelItem(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.forceItemStatus(AuthUtil.parse(headers.authorization).id, id, "cancelled"); }
  /**
   * Force-cancel eligible items in an order.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-7-apply-a-force-action-across-an-orders-eligible-items Applies the force action independently across eligible items.
   */
  @Route.Put("order/:id/cancel")
  public async cancelOrder(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.forceOrderStatus(AuthUtil.parse(headers.authorization).id, id, "cancelled"); }
  /**
   * Force-refund one order item.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-6-force-refund-an-eligible-order-item Applies a force-refund action to one eligible order item.
   */
  @Route.Put("order/item/:id/refund")
  public async refundItem(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.forceItemStatus(AuthUtil.parse(headers.authorization).id, id, "refunded"); }
  /**
   * Force-refund eligible items in an order.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Put("order/:id/refund")
  public async refundOrder(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.forceOrderStatus(AuthUtil.parse(headers.authorization).id, id, "refunded"); }
}


