import type { tags } from "typia";
import type { IPage } from "../typings";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority This DTO family represents req-admin-authority administrator grade authority at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-1-regular-administrator-authority This DTO family represents req-admin-authority-1 regular administrator authority at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority This DTO family represents req-admin-authority-2 super administrator authority at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-3-grant-regular-administrator-authority This DTO family represents req-admin-authority-3 grant regular administrator authority at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-4-promote-an-administrator This DTO family represents req-admin-authority-4 promote an administrator at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-5-demote-another-super-administrator This DTO family represents req-admin-authority-5 demote another super administrator at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-6-prevent-self-demotion This DTO family represents req-admin-authority-6 prevent self-demotion at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight This DTO family represents req-access-boundaries-6 apply platform-wide administrator oversight at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle This DTO family represents req-admin-request-domain administrator request lifecycle at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-1-open-an-administrator-request This DTO family represents req-admin-request-domain-1 open an administrator request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-2-approve-an-administrator-request This DTO family represents req-admin-request-domain-2 approve an administrator request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-3-reject-an-administrator-request This DTO family represents req-admin-request-domain-3 reject an administrator request at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-4-retain-administrator-request-history This DTO family represents req-admin-request-domain-4 retain administrator request history at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations This DTO family represents req-admin-request-functions administrator application operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application This DTO family represents req-admin-request-functions-1 submit an administrator application at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history This DTO family represents req-admin-request-functions-2 view personal application history at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications This DTO family represents req-admin-request-functions-3 list pending administrator applications at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application This DTO family represents req-admin-request-functions-4 approve an administrator application at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application This DTO family represents req-admin-request-functions-5 reject an administrator application at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations This DTO family represents req-admin-grade-functions administrator grade change operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator This DTO family represents req-admin-grade-functions-1 promote a regular administrator at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator This DTO family represents req-admin-grade-functions-2 demote another super administrator at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight This DTO family represents req-order-oversight administrator order oversight at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators This DTO family represents req-category-policies-1 reserve category curation for administrators at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies This DTO family represents req-admin-governance-policies administrator application and grade policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-1-admit-an-administrator-application This DTO family represents req-admin-governance-policies-1 admit an administrator application at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-2-keep-one-pending-application-per-identity This DTO family represents req-admin-governance-policies-2 keep one pending application per identity at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators This DTO family represents req-admin-governance-policies-3 reserve application decisions for super administrators at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-4-grant-the-regular-administrator-grade-on-approval This DTO family represents req-admin-governance-policies-4 grant the regular administrator grade on approval at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-5-provision-the-initial-super-administrator This DTO family represents req-admin-governance-policies-5 provision the initial super administrator at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-6-reserve-super-grade-changes-for-super-administrators This DTO family represents req-admin-governance-policies-6 reserve super-grade changes for super administrators at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-7-refuse-super-administrator-self-demotion This DTO family represents req-admin-governance-policies-7 refuse super-administrator self-demotion at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-8-preserve-one-active-super-administrator-through-closure This DTO family represents req-admin-governance-policies-8 preserve one active super administrator through closure at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies This DTO family represents req-admin-oversight-policies administrator moderation and force-resolution policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-1-inspect-the-complete-platform-record This DTO family represents req-admin-oversight-policies-1 inspect the complete platform record at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history This DTO family represents req-admin-oversight-policies-2 suspend account access without deleting history at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently This DTO family represents req-admin-oversight-policies-3 compose seller suspension and ban independently at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders This DTO family represents req-admin-oversight-policies-4 retire a policy-violating product without rewriting orders at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-5-force-cancel-an-eligible-order-item This DTO family represents req-admin-oversight-policies-5 force-cancel an eligible order item at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-6-force-refund-an-eligible-order-item This DTO family represents req-admin-oversight-policies-6 force-refund an eligible order item at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-7-apply-a-force-action-across-an-orders-eligible-items This DTO family represents req-admin-oversight-policies-7 apply a force action across an order's eligible items at the API boundary. Administrator identity and oversight contract. @evidence docs/analysis/01-actors-and-auth.md Represents shopping_administrators. *
 * @evidence prisma:shopping_administrators This DTO family exposes the shopping_administrators aggregate where the public contract needs it.
 * @evidence prisma:shopping_administrator_sessions This DTO family exposes the shopping_administrator_sessions aggregate where the public contract needs it.
 * @evidence prisma:shopping_administrator_requests This DTO family exposes the shopping_administrator_requests aggregate where the public contract needs it.
 */
export interface IShoppingAdmin {
  /**
   * Administrator UUID.
   * @evidence prisma:shopping_administrators.id Carries the persisted value represented by this DTO property.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Login email.
   * @evidence prisma:shopping_administrators.email Carries the persisted value represented by this DTO property.
   */
  email: string & tags.Format<"email">;
  /**
   * Regular or super grade.
   * @evidence prisma:shopping_administrators.grade Carries the persisted value represented by this DTO property.
   */
  grade: string;
  /**
   * Active state.
   * @evidence prisma:shopping_administrators.status Carries the persisted value represented by this DTO property.
   * @evidence prisma:shopping_administrator_requests.id Application records are returned through the administrator contract.
   * @evidence prisma:shopping_administrator_requests.shopping_administrator_id Application ownership is part of that contract.
   * @evidence prisma:shopping_administrator_requests.status Application decision state is exposed by IApplication.
   * @evidence prisma:shopping_administrator_requests.reason Application rationale is exposed by IApplication.
   * @evidence prisma:shopping_administrator_requests.created_at Application submission time is exposed by IApplication.
   * @evidence prisma:shopping_administrator_requests.decided_at Application decision time is exposed by IApplication.
   */
  status: string;
}
export namespace IShoppingAdmin {
  /** Initial or ordinary administrator registration. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IJoin { email: string & tags.Format<"email">; password: string & tags.MinLength<8>; }
  /** Administrator login. @evidence docs/analysis/01-actors-and-auth.md */
  export interface ILogin { email: string & tags.Format<"email">; password: string & tags.MinLength<8>; }
  /** Issued administrator authorization. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IAuthorized { id: string & tags.Format<"uuid">; accessToken: string; refreshToken: string; }
  /** Refresh input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IRefresh { refreshToken: string; }
  /** Session revocation input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface ILogout { refreshToken?: string; }
  /** Generic moderation request. @evidence docs/analysis/03-functional-requirements.md */
  export interface IRequest { reason: string & tags.MinLength<1>; }
  /** Paginated administrator view. @evidence docs/analysis/03-functional-requirements.md */
  export interface IPageRequest extends IPage.IRequest { search?: null | string; }
  /**
   * Administrator application.
   */
  export interface IApplication {
    /**
     * Application id.
     * @evidence prisma:shopping_administrator_requests.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Applicant identity.
     * @evidence prisma:shopping_administrator_requests.shopping_administrator_id Carries the persisted value represented by this DTO property.
     */
    administratorId: string & tags.Format<"uuid">;
    /**
     * Decision state.
     * @evidence prisma:shopping_administrator_requests.status Carries the persisted value represented by this DTO property.
     */
    status: string;
    /**
     * Applicant reason.
     * @evidence prisma:shopping_administrator_requests.reason Carries the persisted value represented by this DTO property.
     */
    reason: null | string;
    /**
     * Submission time.
     * @evidence prisma:shopping_administrator_requests.created_at Carries the persisted value represented by this DTO property.
     */
    createdAt: string & tags.Format<"date-time">;
    /**
     * Decision time.
     * @evidence prisma:shopping_administrator_requests.decided_at Carries the persisted value represented by this DTO property.
     */
    decidedAt: null | (string & tags.Format<"date-time">);
  }
  /** Generic account or order action. @evidence docs/analysis/03-functional-requirements.md */
  export interface IAction { reason?: null | (string & tags.MinLength<1>); }
}
