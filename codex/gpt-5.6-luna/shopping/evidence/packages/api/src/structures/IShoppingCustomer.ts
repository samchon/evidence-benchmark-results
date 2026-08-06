import type { tags } from "typia";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle This DTO family represents req-customer-identity customer identity and credential lifecycle at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-1-register-a-customer-account This DTO family represents req-customer-identity-1 register a customer account at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-2-log-in-as-a-customer This DTO family represents req-customer-identity-2 log in as a customer at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-3-continue-a-customer-session This DTO family represents req-customer-identity-3 continue a customer session at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-4-log-out-the-current-customer-session This DTO family represents req-customer-identity-4 log out the current customer session at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-5-log-out-every-customer-session This DTO family represents req-customer-identity-5 log out every customer session at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-6-change-the-customer-password This DTO family represents req-customer-identity-6 change the customer password at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access This DTO family represents req-customer-identity-7 recover customer access at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-8-delete-a-customer-account This DTO family represents req-customer-identity-8 delete a customer account at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-2-limit-customer-owned-activity This DTO family represents req-access-boundaries-2 limit customer-owned activity at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model This DTO family represents req-customer-profile-domain customer profile model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information This DTO family represents req-customer-profile-domain-1 define customer profile information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer This DTO family represents req-customer-profile-domain-2 relate a profile to its customer at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-3-remove-profile-data-at-customer-closure This DTO family represents req-customer-profile-domain-3 remove profile data at customer closure at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model This DTO family represents req-shipping-address-domain shipping address model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-1-define-shipping-address-information This DTO family represents req-shipping-address-domain-1 define shipping address information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-2-relate-addresses-to-a-customer This DTO family represents req-shipping-address-domain-2 relate addresses to a customer at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-3-designate-one-default-address This DTO family represents req-shipping-address-domain-3 designate one default address at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-4-preserve-the-purchased-shipping-destination This DTO family represents req-shipping-address-domain-4 preserve the purchased shipping destination at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model This DTO family represents req-wishlist-domain wishlist model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-1-relate-a-wishlist-to-its-customer-and-products This DTO family represents req-wishlist-domain-1 relate a wishlist to its customer and products at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-2-keep-one-entry-per-product This DTO family represents req-wishlist-domain-2 keep one entry per product at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-3-remove-deleted-products-from-wishlists This DTO family represents req-wishlist-domain-3 remove deleted products from wishlists at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-4-order-wishlist-entries-for-paging This DTO family represents req-wishlist-domain-4 order wishlist entries for paging at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-1-relate-a-cart-to-its-customer-and-variants This DTO family represents req-cart-domain-1 relate a cart to its customer and variants at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-2-relate-an-order-to-its-customer-and-items This DTO family represents req-order-domain-2 relate an order to its customer and items at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion This DTO family represents req-review-domain-5 anonymize reviews after customer deletion at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations This DTO family represents req-customer-profile-functions customer profile operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-1-view-the-customer-profile This DTO family represents req-customer-profile-functions-1 view the customer profile at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-2-edit-the-customer-profile This DTO family represents req-customer-profile-functions-2 edit the customer profile at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations This DTO family represents req-shipping-address-functions shipping address operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-1-list-saved-addresses This DTO family represents req-shipping-address-functions-1 list saved addresses at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-2-add-a-shipping-address This DTO family represents req-shipping-address-functions-2 add a shipping address at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-3-edit-a-saved-address This DTO family represents req-shipping-address-functions-3 edit a saved address at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-4-delete-a-saved-address This DTO family represents req-shipping-address-functions-4 delete a saved address at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-5-set-the-default-address This DTO family represents req-shipping-address-functions-5 set the default address at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations This DTO family represents req-wishlist-functions wishlist operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-1-add-a-product-to-the-wishlist This DTO family represents req-wishlist-functions-1 add a product to the wishlist at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-2-view-the-wishlist This DTO family represents req-wishlist-functions-2 view the wishlist at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-3-remove-a-wishlist-product This DTO family represents req-wishlist-functions-3 remove a wishlist product at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history This DTO family represents req-order-history-functions customer order history at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-1-list-customer-orders This DTO family represents req-order-history-functions-1 list customer orders at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts This DTO family represents req-user-oversight-1 list customer accounts at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer This DTO family represents req-user-oversight-2 ban a customer at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer This DTO family represents req-user-oversight-3 unban a customer at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies This DTO family represents req-credential-policies registration and credential policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-1-keep-one-identity-per-canonical-email-and-account-type This DTO family represents req-credential-policies-1 keep one identity per canonical email and account type at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-2-refuse-duplicate-registration This DTO family represents req-credential-policies-2 refuse duplicate registration at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-3-require-current-password-proof-for-password-change This DTO family represents req-credential-policies-3 require current-password proof for password change at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-4-block-unavailable-identities This DTO family represents req-credential-policies-4 block unavailable identities at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies This DTO family represents req-address-policies shipping address policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-1-require-a-complete-shipping-address This DTO family represents req-address-policies-1 require a complete shipping address at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-2-enforce-address-ownership This DTO family represents req-address-policies-2 enforce address ownership at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-3-keep-at-most-one-default-address This DTO family represents req-address-policies-3 keep at most one default address at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement This DTO family represents req-address-policies-4 clear a removed default without automatic replacement at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-5-use-only-a-current-owned-address-at-checkout This DTO family represents req-address-policies-5 use only a current owned address at checkout at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies This DTO family represents req-wishlist-policies wishlist membership policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-1-keep-wishlist-changes-within-the-owning-customer This DTO family represents req-wishlist-policies-1 keep wishlist changes within the owning customer at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-2-admit-one-live-product-entry-per-customer This DTO family represents req-wishlist-policies-2 admit one live product entry per customer at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-3-keep-a-wishlist-entry-product-scoped-and-nonreserving This DTO family represents req-wishlist-policies-3 keep a wishlist entry product-scoped and nonreserving at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-4-page-retained-wishlist-products-consistently This DTO family represents req-wishlist-policies-4 page retained wishlist products consistently at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-1-require-purchasable-lines-and-an-owned-address This DTO family represents req-checkout-policies-1 require purchasable lines and an owned address at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-3-fix-the-purchase-shipping-address This DTO family represents req-checkout-policies-3 fix the purchase shipping address at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies This DTO family represents req-customer-account-policies customer closure and retention policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-1-authenticate-irreversible-customer-closure This DTO family represents req-customer-account-policies-1 authenticate irreversible customer closure at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-2-remove-working-personal-customer-state This DTO family represents req-customer-account-policies-2 remove working personal customer state at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-3-retain-the-commercial-order-graph This DTO family represents req-customer-account-policies-3 retain the commercial order graph at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-4-anonymize-retained-customer-reviews This DTO family represents req-customer-account-policies-4 anonymize retained customer reviews at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-5-keep-customer-closure-permanent This DTO family represents req-customer-account-policies-5 keep customer closure permanent at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-3-remove-former-customer-identity-from-live-presentation This DTO family represents req-nfr-history-continuity-3 remove former-customer identity from live presentation at the API boundary. Customer identity and self-scoped profile contract. @evidence docs/analysis/01-actors-and-auth.md Covers customer identity lifecycle. @evidence docs/analysis/02-domain-model.md Represents shopping_customers and shopping_customer_profiles. *
 * @evidence prisma:shopping_customers This DTO family exposes the shopping_customers aggregate where the public contract needs it.
 * @evidence prisma:shopping_customer_profiles This DTO family exposes the shopping_customer_profiles aggregate where the public contract needs it.
 * @evidence prisma:shopping_customer_sessions This DTO family exposes the shopping_customer_sessions aggregate where the public contract needs it.
 * @evidence prisma:shopping_shipping_addresses This DTO family exposes the shopping_shipping_addresses aggregate where the public contract needs it.
 * @evidence prisma:shopping_wishlists This DTO family exposes the shopping_wishlists aggregate where the public contract needs it.
 * @evidence prisma:shopping_wishlist_entries This DTO family exposes the shopping_wishlist_entries aggregate where the public contract needs it.
 */
export interface IShoppingCustomer {
  /**
   * Identity UUID.
   * @evidence prisma:shopping_customers.id Carries the public customer identity.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Canonical email.
   * @evidence prisma:shopping_customers.email Carries the persisted value represented by this DTO property.
   */
  email: string & tags.Format<"email">;
  /**
   * Account state.
   * @evidence prisma:shopping_customers.status Carries the persisted value represented by this DTO property.
   */
  status: string;
  /**
   * Creation instant.
   * @evidence prisma:shopping_customers.created_at Carries the persisted value represented by this DTO property.
   */
  createdAt: string & tags.Format<"date-time">;
  /**
   * Current profile values.
   * @evidence prisma:shopping_customer_profiles.display_name Carries the public display name.
   * @evidence prisma:shopping_customer_profiles.phone_number Carries the public phone number.
   * @evidence prisma:shopping_shipping_addresses.id Address projections carry saved destinations.
   * @evidence prisma:shopping_shipping_addresses.recipient_name Address projections carry recipient names.
   * @evidence prisma:shopping_shipping_addresses.recipient_phone Address projections carry recipient phones.
   * @evidence prisma:shopping_shipping_addresses.street_address Address projections carry street addresses.
   * @evidence prisma:shopping_shipping_addresses.city Address projections carry cities.
   * @evidence prisma:shopping_shipping_addresses.state Address projections carry states.
   * @evidence prisma:shopping_shipping_addresses.postal_code Address projections carry postal codes.
   * @evidence prisma:shopping_shipping_addresses.country Address projections carry countries.
   * @evidence prisma:shopping_shipping_addresses.is_default Address projections carry default designation.
   * @evidence prisma:shopping_wishlist_entries.id Wishlist projections carry entry identity.
   * @evidence prisma:shopping_wishlist_entries.shopping_product_id Wishlist projections carry product membership.
   * @evidence prisma:shopping_wishlist_entries.created_at Wishlist projections carry entry ordering time.
   */
  profile: IShoppingCustomer.IProfile;
}
export namespace IShoppingCustomer {
  /** Registration input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IJoin {
    /**
     * Email.
     * @evidence prisma:shopping_customers.email Carries the persisted value represented by this DTO property.
     */
    email: string & tags.Format<"email">;
    /**
     * Plaintext password.
     * @evidence prisma:shopping_customers.password_hash Carries the persisted value represented by this DTO property.
     */
    password: string & tags.MinLength<8>;
    /**
     * Initial display name.
     * @evidence prisma:shopping_customer_profiles.display_name Carries the persisted value represented by this DTO property.
     */
    displayName: string & tags.MinLength<1>;
    /**
     * Contact phone.
     * @evidence prisma:shopping_customer_profiles.phone_number Carries the persisted value represented by this DTO property.
     */
    phoneNumber: string & tags.MinLength<1>;
  }
  /** Login input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface ILogin {
    /**
     * Email.
     * @evidence prisma:shopping_customers.email Carries the persisted value represented by this DTO property.
     */
    email: string & tags.Format<"email">;
    /**
     * Plaintext password.
     * @evidence prisma:shopping_customers.password_hash Carries the persisted value represented by this DTO property.
     */
    password: string & tags.MinLength<8>;
  }
  /** Issued access and refresh material. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IAuthorized {
    /**
     * Actor identity.
     * @evidence prisma:shopping_customers.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /** Bearer access token. @evidence docs/analysis/01-actors-and-auth.md */
    accessToken: string;
    /** Refresh token. @evidence docs/analysis/01-actors-and-auth.md */
    refreshToken: string;
  }
  /** Refresh input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IRefresh { refreshToken: string; }
  /** Session/password action input. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IPasswordChange { currentPassword: string & tags.MinLength<8>; newPassword: string & tags.MinLength<8>; }
  /** Irreversible customer closure proof. @evidence docs/analysis/01-actors-and-auth.md */
  export interface IClose { password: string & tags.MinLength<8>; }
  /** Public profile values. @evidence docs/analysis/02-domain-model.md */
  export interface IProfile {
    /**
     * Display name.
     * @evidence prisma:shopping_customer_profiles.display_name Carries the persisted value represented by this DTO property.
     */
    displayName: string;
    /**
     * Phone number.
     * @evidence prisma:shopping_customer_profiles.phone_number Carries the persisted value represented by this DTO property.
     */
    phoneNumber: string;
  }
  /** Profile update input. @evidence docs/analysis/03-functional-requirements.md */
  export type IProfileUpdate = IProfile;
  /** Saved destination. @evidence docs/analysis/02-domain-model.md */
  export interface IAddress {
    /**
     * Address UUID.
     * @evidence prisma:shopping_shipping_addresses.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Recipient name.
     * @evidence prisma:shopping_shipping_addresses.recipient_name Carries the persisted value represented by this DTO property.
     */
    recipientName: string;
    /**
     * Recipient phone.
     * @evidence prisma:shopping_shipping_addresses.recipient_phone Carries the persisted value represented by this DTO property.
     */
    recipientPhone: string;
    /**
     * Street.
     * @evidence prisma:shopping_shipping_addresses.street_address Carries the persisted value represented by this DTO property.
     */
    streetAddress: string;
    /**
     * City.
     * @evidence prisma:shopping_shipping_addresses.city Carries the persisted value represented by this DTO property.
     */
    city: string;
    /**
     * State.
     * @evidence prisma:shopping_shipping_addresses.state Carries the persisted value represented by this DTO property.
     */
    state: string;
    /**
     * Postal code.
     * @evidence prisma:shopping_shipping_addresses.postal_code Carries the persisted value represented by this DTO property.
     */
    postalCode: string;
    /**
     * Country.
     * @evidence prisma:shopping_shipping_addresses.country Carries the persisted value represented by this DTO property.
     */
    country: string;
    /**
     * Default designation.
     * @evidence prisma:shopping_shipping_addresses.is_default Carries the persisted value represented by this DTO property.
     */
    isDefault: boolean;
  }
  /** Address create input. @evidence docs/analysis/03-functional-requirements.md */
  export type IAddressCreate = Omit<IAddress, "id" | "isDefault">;
  /** Address update input. @evidence docs/analysis/03-functional-requirements.md */
  export type IAddressUpdate = IAddressCreate;
  /**
   * Wishlist entry.
   */
  export interface IWishlistEntry { id: string & tags.Format<"uuid">; product: import("./IShoppingProduct").IShoppingProduct.ISummary; createdAt: string & tags.Format<"date-time">; }
}
