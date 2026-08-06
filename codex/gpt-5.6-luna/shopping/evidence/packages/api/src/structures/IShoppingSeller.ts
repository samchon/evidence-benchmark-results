import type { tags } from "typia";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle This DTO family represents req-seller-identity seller identity and credential lifecycle at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account This DTO family represents req-seller-identity-1 register a seller account at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller This DTO family represents req-seller-identity-2 log in as a seller at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session This DTO family represents req-seller-identity-3 continue a seller session at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session This DTO family represents req-seller-identity-4 log out the current seller session at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session This DTO family represents req-seller-identity-5 log out every seller session at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-6-change-the-seller-password This DTO family represents req-seller-identity-6 change the seller password at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access This DTO family represents req-seller-identity-7 recover seller access at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-8-delete-a-seller-account This DTO family represents req-seller-identity-8 delete a seller account at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity This DTO family represents req-access-boundaries-3 limit seller-owned activity at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension This DTO family represents req-access-boundaries-4 preserve duties during seller suspension at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model This DTO family represents req-seller-profile-domain seller profile model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-1-define-seller-profile-information This DTO family represents req-seller-profile-domain-1 define seller profile information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-2-relate-a-profile-to-its-seller This DTO family represents req-seller-profile-domain-2 relate a profile to its seller at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions This DTO family represents req-seller-profile-domain-3 preserve seller profile revisions at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-4-preserve-the-purchase-time-shop-identity This DTO family represents req-seller-profile-domain-4 preserve the purchase-time shop identity at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states This DTO family represents req-seller-account-lifecycle seller account states at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-1-begin-seller-approval-as-pending This DTO family represents req-seller-account-lifecycle-1 begin seller approval as pending at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller This DTO family represents req-seller-account-lifecycle-2 operate as an approved seller at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-3-recover-from-seller-rejection This DTO family represents req-seller-account-lifecycle-3 recover from seller rejection at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-4-restrict-a-suspended-seller This DTO family represents req-seller-account-lifecycle-4 restrict a suspended seller at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-5-restore-an-unsuspended-seller This DTO family represents req-seller-account-lifecycle-5 restore an unsuspended seller at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-6-preserve-records-for-a-banned-seller This DTO family represents req-seller-account-lifecycle-6 preserve records for a banned seller at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-7-retire-a-deleted-seller This DTO family represents req-seller-account-lifecycle-7 retire a deleted seller at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-2-relate-a-product-to-its-seller This DTO family represents req-product-domain-2 relate a product to its seller at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-3-hide-products-during-seller-suspension This DTO family represents req-product-lifecycle-3 hide products during seller suspension at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-4-allow-multi-seller-orders This DTO family represents req-order-domain-4 allow multi-seller orders at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-2-relate-a-shipment-to-its-seller-and-items This DTO family represents req-shipment-domain-2 relate a shipment to its seller and items at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-4-separate-shipments-by-seller This DTO family represents req-shipment-domain-4 separate shipments by seller at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations This DTO family represents req-seller-profile-functions seller profile operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-1-view-the-own-seller-profile This DTO family represents req-seller-profile-functions-1 view the own seller profile at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-2-edit-the-seller-profile This DTO family represents req-seller-profile-functions-2 edit the seller profile at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-3-view-a-public-seller-profile This DTO family represents req-seller-profile-functions-3 view a public seller profile at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations This DTO family represents req-seller-account-functions seller approval and restriction operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-1-view-seller-approval-status This DTO family represents req-seller-account-functions-1 view seller approval status at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-2-resubmit-seller-approval This DTO family represents req-seller-account-functions-2 resubmit seller approval at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals This DTO family represents req-seller-account-functions-3 list pending seller approvals at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration This DTO family represents req-seller-account-functions-4 approve a seller registration at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration This DTO family represents req-seller-account-functions-5 reject a seller registration at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller This DTO family represents req-seller-account-functions-6 suspend a seller at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller This DTO family represents req-seller-account-functions-7 unsuspend a seller at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports This DTO family represents req-seller-dashboard seller dashboard and order-item reports at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-1-view-the-shop-summary This DTO family represents req-seller-dashboard-1 view the shop summary at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-2-list-shop-order-items This DTO family represents req-seller-dashboard-2 list shop order items at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight This DTO family represents req-user-oversight customer and seller account oversight at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts This DTO family represents req-user-oversight-4 list seller accounts at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller This DTO family represents req-user-oversight-5 ban a seller at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller This DTO family represents req-user-oversight-6 unban a seller at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies This DTO family represents req-seller-account-policies seller approval, restriction, and deletion policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-1-require-approval-before-selling This DTO family represents req-seller-account-policies-1 require approval before selling at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason This DTO family represents req-seller-account-policies-2 require and retain a seller rejection reason at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-3-separate-suspension-from-fulfillment-duties This DTO family represents req-seller-account-policies-3 separate suspension from fulfillment duties at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-4-block-seller-deletion-during-active-fulfillment This DTO family represents req-seller-account-policies-4 block seller deletion during active fulfillment at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-5-block-seller-deletion-during-unresolved-requests This DTO family represents req-seller-account-policies-5 block seller deletion during unresolved requests at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-4-block-seller-product-deletion-during-fulfillment This DTO family represents req-product-policies-4 block seller product deletion during fulfillment at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-5-block-seller-product-deletion-during-unresolved-requests This DTO family represents req-product-policies-5 block seller product deletion during unresolved requests at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-2-apply-seller-movement-signs This DTO family represents req-inventory-policies-2 apply seller movement signs at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-1-search-the-eligible-cross-seller-catalog This DTO family represents req-search-policies-1 search the eligible cross-seller catalog at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-2-keep-one-seller-and-destination-per-shipment This DTO family represents req-shipment-policies-2 keep one seller and destination per shipment at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-3-limit-ordinary-cancellation-response-to-the-item-seller This DTO family represents req-cancellation-policies-3 limit ordinary cancellation response to the item seller at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-4-limit-ordinary-refund-response-to-the-item-seller This DTO family represents req-refund-policies-4 limit ordinary refund response to the item seller at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies This DTO family represents req-seller-dashboard-policies seller dashboard calculation policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-1-count-the-sellers-current-products This DTO family represents req-seller-dashboard-policies-1 count the seller's current products at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-2-count-all-retained-seller-order-items This DTO family represents req-seller-dashboard-policies-2 count all retained seller order items at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-3-count-unresolved-seller-requests This DTO family represents req-seller-dashboard-policies-3 count unresolved seller requests at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-4-filter-seller-order-items-by-one-exact-status This DTO family represents req-seller-dashboard-policies-4 filter seller order items by one exact status at the API boundary. Seller identity, approval, and shop profile contract. @evidence docs/analysis/01-actors-and-auth.md Covers seller lifecycle. @evidence docs/analysis/02-domain-model.md Represents shopping_sellers and shopping_seller_profiles. *
 * @evidence prisma:shopping_sellers This DTO family exposes the shopping_sellers aggregate where the public contract needs it.
 * @evidence prisma:shopping_seller_profiles This DTO family exposes the shopping_seller_profiles aggregate where the public contract needs it.
 * @evidence prisma:shopping_seller_sessions This DTO family exposes the shopping_seller_sessions aggregate where the public contract needs it.
 * @evidence prisma:shopping_seller_approval_requests This DTO family exposes the shopping_seller_approval_requests aggregate where the public contract needs it.
 */
export interface IShoppingSeller {
  /**
   * Seller UUID.
   * @evidence prisma:shopping_sellers.id Carries the persisted value represented by this DTO property.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Login email.
   * @evidence prisma:shopping_sellers.email Carries the persisted value represented by this DTO property.
   */
  email: string & tags.Format<"email">;
  /**
   * Approval/moderation state.
   * @evidence prisma:shopping_sellers.status Carries the persisted value represented by this DTO property.
   */
  status: string;
  /**
   * Optional rejection reason.
   * @evidence prisma:shopping_sellers.rejection_reason Carries the persisted value represented by this DTO property.
   */
  rejectionReason: null | string;
  /**
   * Current shop profile.
   * @evidence prisma:shopping_seller_profiles.shop_name Carries the public shop name.
   * @evidence prisma:shopping_seller_profiles.shop_description Carries the public shop description.
   * @evidence prisma:shopping_seller_profiles.logo_image Carries the public shop logo.
   * @evidence prisma:shopping_seller_approval_requests.status Carries approval state.
   * @evidence prisma:shopping_seller_approval_requests.reason Carries approval rationale.
   */
  profile: IShoppingSeller.IProfile;
}
export namespace IShoppingSeller {
  /** Seller registration input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IJoin {
    /**
     * Email.
     * @evidence prisma:shopping_sellers.email Carries the persisted value represented by this DTO property.
     */
    email: string & tags.Format<"email">;
    /**
     * Plaintext password.
     * @evidence prisma:shopping_sellers.password_hash Carries the persisted value represented by this DTO property.
     */
    password: string & tags.MinLength<8>;
    /**
     * Initial shop name.
     * @evidence prisma:shopping_seller_profiles.shop_name Carries the persisted value represented by this DTO property.
     */
    shopName: string & tags.MinLength<1>;
    /**
     * Initial shop description.
     * @evidence prisma:shopping_seller_profiles.shop_description Carries the persisted value represented by this DTO property.
     */
    shopDescription: string;
    /**
     * Initial logo.
     * @evidence prisma:shopping_seller_profiles.logo_image Carries the persisted value represented by this DTO property.
     */
    logoImage: string;
  }
  /** Seller login input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface ILogin { email: string & tags.Format<"email">; password: string & tags.MinLength<8>; }
  /** Issued seller authorization. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IAuthorized { id: string & tags.Format<"uuid">; accessToken: string; refreshToken: string; }
  /** Refresh input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IRefresh { refreshToken: string; }
  /** Session/password action input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IPasswordChange { currentPassword: string & tags.MinLength<8>; newPassword: string & tags.MinLength<8>; }
  /** Seller closure proof. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IClose { password: string & tags.MinLength<8>; }
  /** Public shop values. @evidence docs/analysis/02-domain-model.md */
  export interface IProfile {
    /**
     * Shop name.
     * @evidence prisma:shopping_seller_profiles.shop_name Carries the persisted value represented by this DTO property.
     */
    shopName: string;
    /**
     * Shop description.
     * @evidence prisma:shopping_seller_profiles.shop_description Carries the persisted value represented by this DTO property.
     */
    shopDescription: string;
    /**
     * Logo image.
     * @evidence prisma:shopping_seller_profiles.logo_image Carries the persisted value represented by this DTO property.
     */
    logoImage: string;
  }
  /** Shop profile update input. @evidence docs/analysis/03-functional-requirements.md */
  export type IProfileUpdate = IProfile;
  /** Seller approval status. @evidence docs/analysis/03-functional-requirements.md */
  export interface IApproval {
    /**
     * Approval state.
     * @evidence prisma:shopping_seller_approval_requests.status Carries the persisted value represented by this DTO property.
     */
    status: string;
    /**
     * Decision reason.
     * @evidence prisma:shopping_seller_approval_requests.reason Carries the persisted value represented by this DTO property.
     */
    reason: null | string;
  }
  /** Seller dashboard counts. @evidence docs/analysis/03-functional-requirements.md */
  export interface IDashboard { productCount: number; orderItemCount: number; unresolvedRequestCount: number; }
  /**
   * Seller order item report.
   */
  export interface IOrderItem {
    /**
     * Item id.
     * @evidence prisma:shopping_order_items.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Order identity.
     * @evidence prisma:shopping_order_items.shopping_order_id Carries the persisted value represented by this DTO property.
     */
    orderId: string & tags.Format<"uuid">;
    /**
     * Purchased product name.
     * @evidence prisma:shopping_order_items.product_name Carries the persisted value represented by this DTO property.
     */
    productName: string;
    /**
     * Purchased SKU.
     * @evidence prisma:shopping_order_items.sku Carries the persisted value represented by this DTO property.
     */
    sku: string;
    /**
     * Purchased units.
     * @evidence prisma:shopping_order_items.quantity Carries the persisted value represented by this DTO property.
     */
    quantity: number;
    /**
     * Purchase-time unit price.
     * @evidence prisma:shopping_order_items.unit_price Carries the persisted value represented by this DTO property.
     */
    unitPrice: number;
    /**
     * Item state.
     * @evidence prisma:shopping_order_items.status Carries the persisted value represented by this DTO property.
     */
    status: string;
  }
}
