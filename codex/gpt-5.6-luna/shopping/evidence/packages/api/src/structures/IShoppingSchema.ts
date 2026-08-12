import type { tags } from "typia";

/**
 * Cross-resource contract for persisted, caller-visible facts. Secret storage
 * columns stay server-side and are excluded in the carrier.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-1-register-a-customer-account Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-1-register-a-customer-account Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-2-log-in-as-a-customer Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-2-log-in-as-a-customer Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-3-continue-a-customer-session Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-3-continue-a-customer-session Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-4-log-out-the-current-customer-session Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-4-log-out-the-current-customer-session Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-5-log-out-every-customer-session Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-5-log-out-every-customer-session Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-6-change-the-customer-password Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-6-change-the-customer-password Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-8-delete-a-customer-account Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-8-delete-a-customer-account Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-6-change-the-seller-password Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-6-change-the-seller-password Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-8-delete-a-seller-account Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-8-delete-a-seller-account Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-1-regular-administrator-authority Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-1-regular-administrator-authority Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-3-grant-regular-administrator-authority Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-3-grant-regular-administrator-authority Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-4-promote-an-administrator Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-4-promote-an-administrator Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-5-demote-another-super-administrator Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-5-demote-another-super-administrator Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-6-prevent-self-demotion Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-6-prevent-self-demotion Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-1-require-registration-for-every-feature Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-1-require-registration-for-every-feature Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-2-limit-customer-owned-activity Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-2-limit-customer-owned-activity Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-3-remove-profile-data-at-customer-closure Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-3-remove-profile-data-at-customer-closure Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-1-define-shipping-address-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-1-define-shipping-address-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-2-relate-addresses-to-a-customer Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-2-relate-addresses-to-a-customer Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-3-designate-one-default-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-3-designate-one-default-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-4-preserve-the-purchased-shipping-destination Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-4-preserve-the-purchased-shipping-destination Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-1-define-seller-profile-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-1-define-seller-profile-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-2-relate-a-profile-to-its-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-2-relate-a-profile-to-its-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-4-preserve-the-purchase-time-shop-identity Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-4-preserve-the-purchase-time-shop-identity Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-1-begin-seller-approval-as-pending Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-1-begin-seller-approval-as-pending Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-3-recover-from-seller-rejection Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-3-recover-from-seller-rejection Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-4-restrict-a-suspended-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-4-restrict-a-suspended-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-5-restore-an-unsuspended-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-5-restore-an-unsuspended-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-6-preserve-records-for-a-banned-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-6-preserve-records-for-a-banned-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-7-retire-a-deleted-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-7-retire-a-deleted-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-category-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-1-define-category-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-1-define-category-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-2-limit-the-category-hierarchy Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-2-limit-the-category-hierarchy Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-3-classify-a-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-3-classify-a-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-4-uncategorize-products-after-category-deletion Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-4-uncategorize-products-after-category-deletion Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-product-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-1-define-product-catalog-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-1-define-product-catalog-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-2-relate-a-product-to-its-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-2-relate-a-product-to-its-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-3-order-product-images Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-3-order-product-images Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-4-relate-variants-to-a-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-4-relate-variants-to-a-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-5-relate-products-to-discovery-and-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-5-relate-products-to-discovery-and-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-1-show-a-newly-created-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-1-show-a-newly-created-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-2-mark-a-product-unavailable-without-variants Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-2-mark-a-product-unavailable-without-variants Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-3-hide-products-during-seller-suspension Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-3-hide-products-during-seller-suspension Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-4-remove-live-product-relationships Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-4-remove-live-product-relationships Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-5-retain-history-after-product-deletion Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-5-retain-history-after-product-deletion Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-1-define-variant-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-1-define-variant-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-2-relate-a-variant-to-its-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-2-relate-a-variant-to-its-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-3-resolve-the-effective-variant-price Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-3-resolve-the-effective-variant-price Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-4-calculate-variant-stock Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-4-calculate-variant-stock Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-5-use-variants-as-commerce-units Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-5-use-variants-as-commerce-units Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-1-make-an-in-stock-variant-available Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-1-make-an-in-stock-variant-available Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-2-expose-the-out-of-stock-state Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-2-expose-the-out-of-stock-state Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-3-retire-a-deletable-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-3-retire-a-deletable-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-4-preserve-retired-variant-evidence Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-4-preserve-retired-variant-evidence Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-1-define-an-inventory-movement Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-1-define-an-inventory-movement Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-2-attach-movements-to-one-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-2-attach-movements-to-one-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-3-derive-current-stock-from-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-3-derive-current-stock-from-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-4-distinguish-automatic-commerce-movements Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-4-distinguish-automatic-commerce-movements Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-5-present-complete-inventory-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-5-present-complete-inventory-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-1-define-change-snapshots Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-1-define-change-snapshots Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-2-keep-snapshots-immutable Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-2-keep-snapshots-immutable Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-3-capture-complete-product-state Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-3-capture-complete-product-state Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-4-capture-other-mutable-evidence Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-4-capture-other-mutable-evidence Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-5-capture-purchase-time-item-state Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-5-capture-purchase-time-item-state Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-6-retain-evidence-after-live-deletion Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-6-retain-evidence-after-live-deletion Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-7-limit-snapshot-visibility Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-7-limit-snapshot-visibility Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-1-relate-a-wishlist-to-its-customer-and-products Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-1-relate-a-wishlist-to-its-customer-and-products Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-2-keep-one-entry-per-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-2-keep-one-entry-per-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-3-remove-deleted-products-from-wishlists Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-3-remove-deleted-products-from-wishlists Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-4-order-wishlist-entries-for-paging Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-4-order-wishlist-entries-for-paging Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-1-relate-a-cart-to-its-customer-and-variants Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-1-relate-a-cart-to-its-customer-and-variants Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-2-keep-one-line-per-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-2-keep-one-line-per-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-3-present-cart-line-values Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-3-present-cart-line-values Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-4-calculate-the-cart-total Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-4-calculate-the-cart-total Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-5-expose-cart-availability-problems Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-5-expose-cart-availability-problems Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-order-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-order-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-1-define-order-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-1-define-order-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-2-relate-an-order-to-its-customer-and-items Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-2-relate-an-order-to-its-customer-and-items Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-3-combine-purchased-quantity-by-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-3-combine-purchased-quantity-by-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-4-allow-multi-seller-orders Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-4-allow-multi-seller-orders Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-5-relate-items-to-fulfillment-and-after-sales-records Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-5-relate-items-to-fulfillment-and-after-sales-records Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-1-begin-items-in-paid-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-1-begin-items-in-paid-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-2-transition-paid-items-to-shipped Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-2-transition-paid-items-to-shipped Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-3-transition-shipped-items-to-delivered Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-3-transition-shipped-items-to-delivered Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-4-transition-an-item-to-cancelled Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-4-transition-an-item-to-cancelled Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-5-transition-an-item-to-refunded Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-5-transition-an-item-to-refunded Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-6-preserve-item-facts-across-status-changes Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-6-preserve-item-facts-across-status-changes Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-1-derive-paid-order-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-1-derive-paid-order-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-2-derive-shipped-order-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-2-derive-shipped-order-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-3-derive-delivered-order-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-3-derive-delivered-order-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-4-derive-cancelled-order-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-4-derive-cancelled-order-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-5-derive-refunded-order-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-5-derive-refunded-order-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-6-derive-partially-completed-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-6-derive-partially-completed-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-1-define-shipment-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-1-define-shipment-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-2-relate-a-shipment-to-its-seller-and-items Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-2-relate-a-shipment-to-its-seller-and-items Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-3-permit-split-and-bundled-fulfillment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-3-permit-split-and-bundled-fulfillment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-4-separate-shipments-by-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-4-separate-shipments-by-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-5-share-tracking-and-delivery-by-package Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-5-share-tracking-and-delivery-by-package Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-1-open-a-cancellation-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-1-open-a-cancellation-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-2-approve-a-cancellation-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-2-approve-a-cancellation-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-3-reject-a-cancellation-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-3-reject-a-cancellation-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-4-preserve-cancellation-decision-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-4-preserve-cancellation-decision-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-5-relate-cancellation-participants-and-target Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-5-relate-cancellation-participants-and-target Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-1-open-a-refund-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-1-open-a-refund-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-2-approve-a-refund-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-2-approve-a-refund-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-3-reject-a-refund-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-3-reject-a-refund-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-4-preserve-refund-decision-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-4-preserve-refund-decision-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-5-relate-refund-participants-and-target Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-5-relate-refund-participants-and-target Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-review-model Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-1-open-an-administrator-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-1-open-an-administrator-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-2-approve-an-administrator-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-2-approve-an-administrator-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-3-reject-an-administrator-request Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-3-reject-an-administrator-request Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-4-retain-administrator-request-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-4-retain-administrator-request-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-1-view-the-customer-profile Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-1-view-the-customer-profile Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-2-edit-the-customer-profile Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-2-edit-the-customer-profile Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-1-list-saved-addresses Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-1-list-saved-addresses Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-2-add-a-shipping-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-2-add-a-shipping-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-3-edit-a-saved-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-3-edit-a-saved-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-4-delete-a-saved-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-4-delete-a-saved-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-5-set-the-default-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-5-set-the-default-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-1-view-the-own-seller-profile Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-1-view-the-own-seller-profile Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-2-edit-the-seller-profile Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-2-edit-the-seller-profile Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-3-view-a-public-seller-profile Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-3-view-a-public-seller-profile Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-1-view-seller-approval-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-1-view-seller-approval-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-2-resubmit-seller-approval Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-2-resubmit-seller-approval Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-1-create-a-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-1-create-a-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-2-edit-a-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-2-edit-a-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-3-delete-an-owned-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-3-delete-an-owned-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-6-view-any-product-snapshots Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-6-view-any-product-snapshots Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-1-add-a-product-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-1-add-a-product-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-2-edit-a-product-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-2-edit-a-product-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-3-delete-a-product-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-3-delete-a-product-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-1-restock-a-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-1-restock-a-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-3-view-variant-inventory-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-3-view-variant-inventory-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-1-search-the-product-catalog Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-1-search-the-product-catalog Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-2-compare-product-cards Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-2-compare-product-cards Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-3-view-product-details Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-3-view-product-details Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-1-add-a-product-to-the-wishlist Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-1-add-a-product-to-the-wishlist Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-2-view-the-wishlist Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-2-view-the-wishlist Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-3-remove-a-wishlist-product Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-3-remove-a-wishlist-product Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-2-view-the-shopping-cart Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-2-view-the-shopping-cart Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-3-change-cart-quantity Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-3-change-cart-quantity Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-4-remove-a-cart-line Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-4-remove-a-cart-line Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-1-start-checkout Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-1-start-checkout Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-2-review-the-order-summary Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-2-review-the-order-summary Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-3-confirm-and-initiate-payment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-3-confirm-and-initiate-payment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-4-recover-from-payment-failure Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-4-recover-from-payment-failure Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-5-create-the-paid-order Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-5-create-the-paid-order Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-6-commit-stock-and-cart-effects Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-6-commit-stock-and-cart-effects Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-1-list-customer-orders Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-1-list-customer-orders Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-2-view-order-details Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-2-view-order-details Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-3-view-order-shipments Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-3-view-order-shipments Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-2-create-a-shipment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-2-create-a-shipment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-3-view-shipment-tracking Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-3-view-shipment-tracking Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-4-confirm-shipment-delivery Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-4-confirm-shipment-delivery Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-5-auto-confirm-shipment-delivery Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-5-auto-confirm-shipment-delivery Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-1-request-item-cancellation Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-1-request-item-cancellation Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-3-approve-item-cancellation Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-3-approve-item-cancellation Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-4-reject-item-cancellation Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-4-reject-item-cancellation Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-5-commit-approved-cancellation-effects Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-5-commit-approved-cancellation-effects Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-1-request-an-item-refund Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-1-request-an-item-refund Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-3-approve-an-item-refund Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-3-approve-an-item-refund Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-4-reject-an-item-refund Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-4-reject-an-item-refund Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-5-commit-approved-refund-effects Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-5-commit-approved-refund-effects Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-1-view-the-shop-summary Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-dashboard-1-view-the-shop-summary Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-2-list-shop-order-items Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-dashboard-2-list-shop-order-items Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-1-list-platform-orders Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-1-list-platform-orders Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-1-keep-one-identity-per-canonical-email-and-account-type Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-1-keep-one-identity-per-canonical-email-and-account-type Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-2-refuse-duplicate-registration Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-2-refuse-duplicate-registration Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-3-require-current-password-proof-for-password-change Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-3-require-current-password-proof-for-password-change Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-4-block-unavailable-identities Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-4-block-unavailable-identities Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-1-require-a-complete-shipping-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-1-require-a-complete-shipping-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-2-enforce-address-ownership Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-2-enforce-address-ownership Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-3-keep-at-most-one-default-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-3-keep-at-most-one-default-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-5-use-only-a-current-owned-address-at-checkout Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-5-use-only-a-current-owned-address-at-checkout Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-1-require-approval-before-selling Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-1-require-approval-before-selling Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-3-separate-suspension-from-fulfillment-duties Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-3-separate-suspension-from-fulfillment-duties Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-4-block-seller-deletion-during-active-fulfillment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-4-block-seller-deletion-during-active-fulfillment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-5-block-seller-deletion-during-unresolved-requests Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-5-block-seller-deletion-during-unresolved-requests Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-3-assign-products-only-to-live-categories Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-3-assign-products-only-to-live-categories Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-4-uncategorize-products-when-taxonomy-is-retired Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-4-uncategorize-products-when-taxonomy-is-retired Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-1-require-valid-product-catalog-data Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-1-require-valid-product-catalog-data Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-2-enforce-product-ownership Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-2-enforce-product-ownership Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-3-snapshot-the-complete-aggregate-on-catalog-edit Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-3-snapshot-the-complete-aggregate-on-catalog-edit Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-4-block-seller-product-deletion-during-fulfillment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-4-block-seller-product-deletion-during-fulfillment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-5-block-seller-product-deletion-during-unresolved-requests Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-5-block-seller-product-deletion-during-unresolved-requests Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-6-retire-violating-merchandise-without-stranding-obligations Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-6-retire-violating-merchandise-without-stranding-obligations Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-1-require-a-unique-sku-and-concrete-option-combination Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-1-require-a-unique-sku-and-concrete-option-combination Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-2-validate-the-optional-price-override Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-2-validate-the-optional-price-override Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-3-require-an-available-variant-for-purchase Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-3-require-an-available-variant-for-purchase Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-4-block-variant-deletion-during-fulfillment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-4-block-variant-deletion-during-fulfillment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-5-block-variant-deletion-during-unresolved-requests Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-5-block-variant-deletion-during-unresolved-requests Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-1-require-attributable-nonzero-inventory-movements Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-1-require-attributable-nonzero-inventory-movements Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-2-apply-seller-movement-signs Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-2-apply-seller-movement-signs Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-3-prevent-negative-or-reserved-stock-depletion Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-3-prevent-negative-or-reserved-stock-depletion Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-4-deduct-purchased-quantity-at-order-creation Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-4-deduct-purchased-quantity-at-order-creation Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-5-restore-returned-item-quantity-exactly-once Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-5-restore-returned-item-quantity-exactly-once Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-1-create-evidence-for-covered-commercial-changes Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-1-create-evidence-for-covered-commercial-changes Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-2-capture-the-complete-product-aggregate Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-2-capture-the-complete-product-aggregate Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-3-use-inventory-history-for-stock-changes Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-3-use-inventory-history-for-stock-changes Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-4-keep-snapshots-immutable-and-undeletable Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-4-keep-snapshots-immutable-and-undeletable Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-5-limit-snapshot-evidence-to-relevant-parties Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-5-limit-snapshot-evidence-to-relevant-parties Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-1-search-the-eligible-cross-seller-catalog Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-1-search-the-eligible-cross-seller-catalog Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-2-combine-product-search-constraints Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-2-combine-product-search-constraints Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-3-order-and-page-search-results-deterministically Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-3-order-and-page-search-results-deterministically Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-4-render-the-standard-product-card Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-4-render-the-standard-product-card Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-1-keep-wishlist-changes-within-the-owning-customer Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-1-keep-wishlist-changes-within-the-owning-customer Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-2-admit-one-live-product-entry-per-customer Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-2-admit-one-live-product-entry-per-customer Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-3-keep-a-wishlist-entry-product-scoped-and-nonreserving Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-3-keep-a-wishlist-entry-product-scoped-and-nonreserving Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-4-page-retained-wishlist-products-consistently Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-4-page-retained-wishlist-products-consistently Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-1-require-a-positive-whole-unit-cart-quantity Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-1-require-a-positive-whole-unit-cart-quantity Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-3-admit-only-a-purchasable-live-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-3-admit-only-a-purchasable-live-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-4-expose-current-cart-price-and-availability Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-4-expose-current-cart-price-and-availability Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-5-exclude-ineligible-lines-from-checkout Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-5-exclude-ineligible-lines-from-checkout Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-1-require-purchasable-lines-and-an-owned-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-1-require-purchasable-lines-and-an-owned-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-2-refresh-material-purchase-facts-before-charge Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-2-refresh-material-purchase-facts-before-charge Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-3-fix-the-purchase-shipping-address Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-3-fix-the-purchase-shipping-address Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-4-recover-cleanly-from-unsuccessful-payment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-4-recover-cleanly-from-unsuccessful-payment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-5-make-gateway-success-idempotent Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-5-make-gateway-success-idempotent Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-6-commit-the-successful-purchase-atomically Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-6-commit-the-successful-purchase-atomically Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-1-calculate-the-fixed-purchase-total Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-1-calculate-the-fixed-purchase-total Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-2-consolidate-purchased-units-by-variant Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-2-consolidate-purchased-units-by-variant Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-3-keep-fulfillment-and-resolution-item-scoped Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-3-keep-fulfillment-and-resolution-item-scoped Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-4-derive-the-complete-overall-order-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-4-derive-the-complete-overall-order-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-5-present-orders-from-purchase-time-evidence Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-5-present-orders-from-purchase-time-evidence Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-1-select-eligible-paid-items-for-shipment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-1-select-eligible-paid-items-for-shipment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-2-keep-one-seller-and-destination-per-shipment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-2-keep-one-seller-and-destination-per-shipment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-3-require-complete-shared-tracking-information Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-3-require-complete-shared-tracking-information Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-4-ship-all-package-items-together Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-4-ship-all-package-items-together Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-5-confirm-delivery-for-the-whole-shipment Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-5-confirm-delivery-for-the-whole-shipment Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-6-complete-unconfirmed-shipments-after-fourteen-days Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-6-complete-unconfirmed-shipments-after-fourteen-days Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-1-admit-a-cancellation-request-for-a-paid-item Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-1-admit-a-cancellation-request-for-a-paid-item Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-2-keep-one-pending-cancellation-decision-per-item Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-2-keep-one-pending-cancellation-decision-per-item Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-3-limit-ordinary-cancellation-response-to-the-item-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-3-limit-ordinary-cancellation-response-to-the-item-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-4-decide-a-pending-cancellation-once Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-4-decide-a-pending-cancellation-once Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-5-apply-an-approved-cancellation-atomically Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-5-apply-an-approved-cancellation-atomically Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-1-admit-a-timely-refund-request-for-a-delivered-item Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-1-admit-a-timely-refund-request-for-a-delivered-item Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-2-close-the-refund-window-after-seven-days Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-2-close-the-refund-window-after-seven-days Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-3-keep-one-pending-refund-decision-per-item Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-3-keep-one-pending-refund-decision-per-item Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-4-limit-ordinary-refund-response-to-the-item-seller Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-4-limit-ordinary-refund-response-to-the-item-seller Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-5-decide-a-pending-refund-once Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-5-decide-a-pending-refund-once Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-6-apply-an-approved-refund-atomically Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-6-apply-an-approved-refund-atomically Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-1-authenticate-irreversible-customer-closure Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-1-authenticate-irreversible-customer-closure Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-2-remove-working-personal-customer-state Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-2-remove-working-personal-customer-state Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-3-retain-the-commercial-order-graph Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-3-retain-the-commercial-order-graph Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-4-anonymize-retained-customer-reviews Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-4-anonymize-retained-customer-reviews Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-5-keep-customer-closure-permanent Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-5-keep-customer-closure-permanent Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-1-admit-an-administrator-application Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-1-admit-an-administrator-application Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-2-keep-one-pending-application-per-identity Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-2-keep-one-pending-application-per-identity Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-3-reserve-application-decisions-for-super-administrators Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-4-grant-the-regular-administrator-grade-on-approval Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-4-grant-the-regular-administrator-grade-on-approval Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-5-provision-the-initial-super-administrator Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-5-provision-the-initial-super-administrator Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-6-reserve-super-grade-changes-for-super-administrators Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-6-reserve-super-grade-changes-for-super-administrators Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-7-refuse-super-administrator-self-demotion Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-7-refuse-super-administrator-self-demotion Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-8-preserve-one-active-super-administrator-through-closure Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-8-preserve-one-active-super-administrator-through-closure Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-1-inspect-the-complete-platform-record Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-1-inspect-the-complete-platform-record Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-2-suspend-account-access-without-deleting-history Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-5-force-cancel-an-eligible-order-item Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-5-force-cancel-an-eligible-order-item Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-6-force-refund-an-eligible-order-item Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-6-force-refund-an-eligible-order-item Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-7-apply-a-force-action-across-an-orders-eligible-items Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-7-apply-a-force-action-across-an-orders-eligible-items Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-1-count-the-sellers-current-products Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-1-count-the-sellers-current-products Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-2-count-all-retained-seller-order-items Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-2-count-all-retained-seller-order-items Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-3-count-unresolved-seller-requests Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-3-count-unresolved-seller-requests Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-4-filter-seller-order-items-by-one-exact-status Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-4-filter-seller-order-items-by-one-exact-status Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-1-keep-commercial-change-evidence-immutable Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-audit-integrity-1-keep-commercial-change-evidence-immutable Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-2-reconstruct-each-recorded-modification Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-audit-integrity-2-reconstruct-each-recorded-modification Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-3-preserve-a-complete-product-time-point Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-audit-integrity-3-preserve-a-complete-product-time-point Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-4-trace-stock-and-purchase-evidence-end-to-end Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-audit-integrity-4-trace-stock-and-purchase-evidence-end-to-end Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-1-expose-one-complete-successful-purchase-outcome Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-1-expose-one-complete-successful-purchase-outcome Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-2-preserve-a-clean-state-after-payment-failure Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-2-preserve-a-clean-state-after-payment-failure Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-3-keep-each-commercial-reversal-synchronized Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-3-keep-each-commercial-reversal-synchronized Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-4-preserve-independent-item-progress Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-4-preserve-independent-item-progress Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-1-keep-commercial-history-through-retirement Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-1-keep-commercial-history-through-retirement Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-3-remove-former-customer-identity-from-live-presentation Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-3-remove-former-customer-identity-from-live-presentation Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-4-limit-retained-history-to-relevant-parties Defines the caller-visible persisted facts for this requirement unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-4-limit-retained-history-to-relevant-parties Read the requirement's data contract and compared this shared public schema's persisted fields with the cited unit.
* @evidence prisma:shopping_customers Represents caller-visible persisted model shopping_customers.
 * @evidenceReview prisma:shopping_customers Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_customer_sessions Represents caller-visible persisted model shopping_customer_sessions.
 * @evidenceReview prisma:shopping_customer_sessions Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_customer_profiles Represents caller-visible persisted model shopping_customer_profiles.
 * @evidenceReview prisma:shopping_customer_profiles Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_customer_addresses Represents caller-visible persisted model shopping_customer_addresses.
 * @evidenceReview prisma:shopping_customer_addresses Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_sellers Represents caller-visible persisted model shopping_sellers.
 * @evidenceReview prisma:shopping_sellers Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_seller_sessions Represents caller-visible persisted model shopping_seller_sessions.
 * @evidenceReview prisma:shopping_seller_sessions Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_seller_profiles Represents caller-visible persisted model shopping_seller_profiles.
 * @evidenceReview prisma:shopping_seller_profiles Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_seller_approval_requests Represents caller-visible persisted model shopping_seller_approval_requests.
 * @evidenceReview prisma:shopping_seller_approval_requests Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_seller_profile_snapshots Represents caller-visible persisted model shopping_seller_profile_snapshots.
 * @evidenceReview prisma:shopping_seller_profile_snapshots Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_delivery_challenges Represents caller-visible persisted model shopping_delivery_challenges.
 * @evidenceReview prisma:shopping_delivery_challenges Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_administrator_grades Represents caller-visible persisted model shopping_administrator_grades.
 * @evidenceReview prisma:shopping_administrator_grades Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_administrator_grade_events Represents caller-visible persisted model shopping_administrator_grade_events.
 * @evidenceReview prisma:shopping_administrator_grade_events Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_categories Represents caller-visible persisted model shopping_categories.
 * @evidenceReview prisma:shopping_categories Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_products Represents caller-visible persisted model shopping_products.
 * @evidenceReview prisma:shopping_products Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_product_images Represents caller-visible persisted model shopping_product_images.
 * @evidenceReview prisma:shopping_product_images Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_product_variants Represents caller-visible persisted model shopping_product_variants.
 * @evidenceReview prisma:shopping_product_variants Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_inventory_movements Represents caller-visible persisted model shopping_inventory_movements.
 * @evidenceReview prisma:shopping_inventory_movements Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_product_snapshots Represents caller-visible persisted model shopping_product_snapshots.
 * @evidenceReview prisma:shopping_product_snapshots Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_wishlist_entries Represents caller-visible persisted model shopping_wishlist_entries.
 * @evidenceReview prisma:shopping_wishlist_entries Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_carts Represents caller-visible persisted model shopping_carts.
 * @evidenceReview prisma:shopping_carts Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_cart_lines Represents caller-visible persisted model shopping_cart_lines.
 * @evidenceReview prisma:shopping_cart_lines Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_orders Represents caller-visible persisted model shopping_orders.
 * @evidenceReview prisma:shopping_orders Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_order_items Represents caller-visible persisted model shopping_order_items.
 * @evidenceReview prisma:shopping_order_items Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_order_item_snapshots Represents caller-visible persisted model shopping_order_item_snapshots.
 * @evidenceReview prisma:shopping_order_item_snapshots Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_payment_attempts Represents caller-visible persisted model shopping_payment_attempts.
 * @evidenceReview prisma:shopping_payment_attempts Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_shipments Represents caller-visible persisted model shopping_shipments.
 * @evidenceReview prisma:shopping_shipments Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_shipment_items Represents caller-visible persisted model shopping_shipment_items.
 * @evidenceReview prisma:shopping_shipment_items Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_cancellation_requests Represents caller-visible persisted model shopping_cancellation_requests.
 * @evidenceReview prisma:shopping_cancellation_requests Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_cancellation_snapshots Represents caller-visible persisted model shopping_cancellation_snapshots.
 * @evidenceReview prisma:shopping_cancellation_snapshots Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_refund_requests Represents caller-visible persisted model shopping_refund_requests.
 * @evidenceReview prisma:shopping_refund_requests Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_refund_snapshots Represents caller-visible persisted model shopping_refund_snapshots.
 * @evidenceReview prisma:shopping_refund_snapshots Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_reviews Represents caller-visible persisted model shopping_reviews.
 * @evidenceReview prisma:shopping_reviews Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_review_snapshots Represents caller-visible persisted model shopping_review_snapshots.
 * @evidenceReview prisma:shopping_review_snapshots Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_administrator_requests Represents caller-visible persisted model shopping_administrator_requests.
 * @evidenceReview prisma:shopping_administrator_requests Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 * @evidence prisma:shopping_moderation_events Represents caller-visible persisted model shopping_moderation_events.
 * @evidenceReview prisma:shopping_moderation_events Compared this schema contract with the cited Prisma model and verified its caller-visible fields.
 */
export interface IShoppingSchema {
  /**
   * @evidence prisma:shopping_customers.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customers.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customers_id: string;
  /**
   * @evidence prisma:shopping_customers.email Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customers.email Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customers_email: string;
  /**
   * @evidence prisma:shopping_customers.login_status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customers.login_status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customers_login_status: string;
  /**
   * @evidence prisma:shopping_customers.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customers.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customers_created_at: string;
  /**
   * @evidence prisma:shopping_customers.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customers.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customers_updated_at: string;
  /**
   * @evidence prisma:shopping_customers.deleted_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customers.deleted_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customers_deleted_at: string;
  /**
   * @evidence prisma:shopping_customers.display_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customers.display_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customers_display_name: string;
  /**
   * @evidence prisma:shopping_customers.phone_number Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customers.phone_number Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customers_phone_number: string;
  /**
   * @evidence prisma:shopping_customer_sessions.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_sessions.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_sessions_id: string;
  /**
   * @evidence prisma:shopping_customer_sessions.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_sessions.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_sessions_customer_id: string;
  /**
   * @evidence prisma:shopping_customer_sessions.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_sessions.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_sessions_created_at: string;
  /**
   * @evidence prisma:shopping_customer_sessions.expired_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_sessions.expired_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_sessions_expired_at: string;
  /**
   * @evidence prisma:shopping_customer_sessions.revoked_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_sessions.revoked_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_sessions_revoked_at: string;
  /**
   * @evidence prisma:shopping_customer_profiles.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_profiles.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_profiles_id: string;
  /**
   * @evidence prisma:shopping_customer_profiles.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_profiles.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_profiles_customer_id: string;
  /**
   * @evidence prisma:shopping_customer_profiles.display_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_profiles.display_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_profiles_display_name: string;
  /**
   * @evidence prisma:shopping_customer_profiles.phone_number Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_profiles.phone_number Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_profiles_phone_number: string;
  /**
   * @evidence prisma:shopping_customer_profiles.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_profiles.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_profiles_created_at: string;
  /**
   * @evidence prisma:shopping_customer_profiles.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_profiles.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_profiles_updated_at: string;
  /**
   * @evidence prisma:shopping_customer_addresses.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_id: string;
  /**
   * @evidence prisma:shopping_customer_addresses.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_customer_id: string;
  /**
   * @evidence prisma:shopping_customer_addresses.recipient_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.recipient_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_recipient_name: string;
  /**
   * @evidence prisma:shopping_customer_addresses.recipient_phone Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.recipient_phone Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_recipient_phone: string;
  /**
   * @evidence prisma:shopping_customer_addresses.street_address Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.street_address Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_street_address: string;
  /**
   * @evidence prisma:shopping_customer_addresses.city Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.city Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_city: string;
  /**
   * @evidence prisma:shopping_customer_addresses.state_or_province Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.state_or_province Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_state_or_province: string;
  /**
   * @evidence prisma:shopping_customer_addresses.postal_code Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.postal_code Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_postal_code: string;
  /**
   * @evidence prisma:shopping_customer_addresses.country Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.country Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_country: string;
  /**
   * @evidence prisma:shopping_customer_addresses.is_default Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.is_default Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_is_default: boolean;
  /**
   * @evidence prisma:shopping_customer_addresses.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_created_at: string;
  /**
   * @evidence prisma:shopping_customer_addresses.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_customer_addresses.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_customer_addresses_updated_at: string;
  /**
   * @evidence prisma:shopping_sellers.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_id: string;
  /**
   * @evidence prisma:shopping_sellers.email Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.email Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_email: string;
  /**
   * @evidence prisma:shopping_sellers.approval_status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.approval_status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_approval_status: string;
  /**
   * @evidence prisma:shopping_sellers.login_status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.login_status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_login_status: string;
  /**
   * @evidence prisma:shopping_sellers.suspended_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.suspended_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_suspended_at: string;
  /**
   * @evidence prisma:shopping_sellers.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_created_at: string;
  /**
   * @evidence prisma:shopping_sellers.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_updated_at: string;
  /**
   * @evidence prisma:shopping_sellers.deleted_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.deleted_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_deleted_at: string;
  /**
   * @evidence prisma:shopping_sellers.shop_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.shop_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_shop_name: string;
  /**
   * @evidence prisma:shopping_sellers.shop_description Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.shop_description Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_shop_description: string;
  /**
   * @evidence prisma:shopping_sellers.logo_image Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_sellers.logo_image Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_sellers_logo_image: string;
  /**
   * @evidence prisma:shopping_seller_sessions.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_sessions.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_sessions_id: string;
  /**
   * @evidence prisma:shopping_seller_sessions.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_sessions.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_sessions_seller_id: string;
  /**
   * @evidence prisma:shopping_seller_sessions.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_sessions.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_sessions_created_at: string;
  /**
   * @evidence prisma:shopping_seller_sessions.expired_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_sessions.expired_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_sessions_expired_at: string;
  /**
   * @evidence prisma:shopping_seller_sessions.revoked_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_sessions.revoked_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_sessions_revoked_at: string;
  /**
   * @evidence prisma:shopping_seller_profiles.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profiles.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profiles_id: string;
  /**
   * @evidence prisma:shopping_seller_profiles.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profiles.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profiles_seller_id: string;
  /**
   * @evidence prisma:shopping_seller_profiles.shop_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profiles.shop_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profiles_shop_name: string;
  /**
   * @evidence prisma:shopping_seller_profiles.shop_description Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profiles.shop_description Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profiles_shop_description: string;
  /**
   * @evidence prisma:shopping_seller_profiles.logo_image Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profiles.logo_image Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profiles_logo_image: string;
  /**
   * @evidence prisma:shopping_seller_profiles.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profiles.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profiles_created_at: string;
  /**
   * @evidence prisma:shopping_seller_profiles.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profiles.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profiles_updated_at: string;
  /**
   * @evidence prisma:shopping_seller_approval_requests.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_approval_requests.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_approval_requests_id: string;
  /**
   * @evidence prisma:shopping_seller_approval_requests.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_approval_requests.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_approval_requests_seller_id: string;
  /**
   * @evidence prisma:shopping_seller_approval_requests.reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_approval_requests.reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_approval_requests_reason: string;
  /**
   * @evidence prisma:shopping_seller_approval_requests.status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_approval_requests.status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_approval_requests_status: string;
  /**
   * @evidence prisma:shopping_seller_approval_requests.decision_reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_approval_requests.decision_reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_approval_requests_decision_reason: string;
  /**
   * @evidence prisma:shopping_seller_approval_requests.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_approval_requests.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_approval_requests_created_at: string;
  /**
   * @evidence prisma:shopping_seller_approval_requests.decided_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_approval_requests.decided_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_approval_requests_decided_at: string;
  /**
   * @evidence prisma:shopping_seller_approval_requests.decided_by Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_approval_requests.decided_by Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_approval_requests_decided_by: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_id: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_seller_id: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.changed_fields Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.changed_fields Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_changed_fields: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.before_shop_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.before_shop_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_before_shop_name: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.after_shop_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.after_shop_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_after_shop_name: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.before_shop_description Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.before_shop_description Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_before_shop_description: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.after_shop_description Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.after_shop_description Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_after_shop_description: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.before_logo_image Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.before_logo_image Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_before_logo_image: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.after_logo_image Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.after_logo_image Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_after_logo_image: string;
  /**
   * @evidence prisma:shopping_seller_profile_snapshots.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_seller_profile_snapshots.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_seller_profile_snapshots_created_at: string;
  /**
   * @evidence prisma:shopping_delivery_challenges.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_delivery_challenges.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_delivery_challenges_id: string;
  /**
   * @evidence prisma:shopping_delivery_challenges.actor_type Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_delivery_challenges.actor_type Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_delivery_challenges_actor_type: string;
  /**
   * @evidence prisma:shopping_delivery_challenges.actor_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_delivery_challenges.actor_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_delivery_challenges_actor_id: string;
  /**
   * @evidence prisma:shopping_delivery_challenges.recipient Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_delivery_challenges.recipient Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_delivery_challenges_recipient: string;
  /**
   * @evidence prisma:shopping_delivery_challenges.kind Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_delivery_challenges.kind Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_delivery_challenges_kind: string;
  /**
   * @evidence prisma:shopping_delivery_challenges.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_delivery_challenges.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_delivery_challenges_created_at: string;
  /**
   * @evidence prisma:shopping_delivery_challenges.expired_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_delivery_challenges.expired_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_delivery_challenges_expired_at: string;
  /**
   * @evidence prisma:shopping_delivery_challenges.consumed_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_delivery_challenges.consumed_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_delivery_challenges_consumed_at: string;
  /**
   * @evidence prisma:shopping_administrator_grades.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grades.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grades_id: string;
  /**
   * @evidence prisma:shopping_administrator_grades.actor_type Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grades.actor_type Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grades_actor_type: string;
  /**
   * @evidence prisma:shopping_administrator_grades.actor_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grades.actor_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grades_actor_id: string;
  /**
   * @evidence prisma:shopping_administrator_grades.grade Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grades.grade Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grades_grade: string;
  /**
   * @evidence prisma:shopping_administrator_grades.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grades.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grades_created_at: string;
  /**
   * @evidence prisma:shopping_administrator_grade_events.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grade_events.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grade_events_id: string;
  /**
   * @evidence prisma:shopping_administrator_grade_events.actor_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grade_events.actor_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grade_events_actor_id: string;
  /**
   * @evidence prisma:shopping_administrator_grade_events.target_type Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grade_events.target_type Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grade_events_target_type: string;
  /**
   * @evidence prisma:shopping_administrator_grade_events.target_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grade_events.target_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grade_events_target_id: string;
  /**
   * @evidence prisma:shopping_administrator_grade_events.action Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grade_events.action Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grade_events_action: string;
  /**
   * @evidence prisma:shopping_administrator_grade_events.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_grade_events.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_grade_events_created_at: string;
  /**
   * @evidence prisma:shopping_categories.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_categories.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_categories_id: string;
  /**
   * @evidence prisma:shopping_categories.name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_categories.name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_categories_name: string;
  /**
   * @evidence prisma:shopping_categories.description Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_categories.description Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_categories_description: string;
  /**
   * @evidence prisma:shopping_categories.parent_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_categories.parent_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_categories_parent_id: string;
  /**
   * @evidence prisma:shopping_categories.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_categories.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_categories_created_at: string;
  /**
   * @evidence prisma:shopping_categories.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_categories.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_categories_updated_at: string;
  /**
   * @evidence prisma:shopping_categories.deleted_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_categories.deleted_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_categories_deleted_at: string;
  /**
   * @evidence prisma:shopping_products.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_id: string;
  /**
   * @evidence prisma:shopping_products.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_seller_id: string;
  /**
   * @evidence prisma:shopping_products.category_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.category_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_category_id: string;
  /**
   * @evidence prisma:shopping_products.name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_name: string;
  /**
   * @evidence prisma:shopping_products.description Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.description Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_description: string;
  /**
   * @evidence prisma:shopping_products.base_price Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.base_price Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_base_price: number;
  /**
   * @evidence prisma:shopping_products.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_created_at: string;
  /**
   * @evidence prisma:shopping_products.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_updated_at: string;
  /**
   * @evidence prisma:shopping_products.deleted_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_products.deleted_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_products_deleted_at: string;
  /**
   * @evidence prisma:shopping_product_images.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_images.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_images_id: string;
  /**
   * @evidence prisma:shopping_product_images.product_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_images.product_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_images_product_id: string;
  /**
   * @evidence prisma:shopping_product_images.uri Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_images.uri Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_images_uri: string;
  /**
   * @evidence prisma:shopping_product_images.sequence Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_images.sequence Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_images_sequence: number;
  /**
   * @evidence prisma:shopping_product_images.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_images.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_images_created_at: string;
  /**
   * @evidence prisma:shopping_product_variants.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_variants.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_variants_id: string;
  /**
   * @evidence prisma:shopping_product_variants.product_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_variants.product_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_variants_product_id: string;
  /**
   * @evidence prisma:shopping_product_variants.sku_code Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_variants.sku_code Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_variants_sku_code: string;
  /**
   * @evidence prisma:shopping_product_variants.option_values Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_variants.option_values Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_variants_option_values: string;
  /**
   * @evidence prisma:shopping_product_variants.price_override Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_variants.price_override Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_variants_price_override: string;
  /**
   * @evidence prisma:shopping_product_variants.deleted_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_variants.deleted_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_variants_deleted_at: string;
  /**
   * @evidence prisma:shopping_product_variants.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_variants.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_variants_created_at: string;
  /**
   * @evidence prisma:shopping_product_variants.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_variants.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_variants_updated_at: string;
  /**
   * @evidence prisma:shopping_inventory_movements.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_inventory_movements.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_inventory_movements_id: string;
  /**
   * @evidence prisma:shopping_inventory_movements.variant_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_inventory_movements.variant_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_inventory_movements_variant_id: string;
  /**
   * @evidence prisma:shopping_inventory_movements.quantity_delta Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_inventory_movements.quantity_delta Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_inventory_movements_quantity_delta: string;
  /**
   * @evidence prisma:shopping_inventory_movements.reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_inventory_movements.reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_inventory_movements_reason: string;
  /**
   * @evidence prisma:shopping_inventory_movements.order_item_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_inventory_movements.order_item_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_inventory_movements_order_item_id: string;
  /**
   * @evidence prisma:shopping_inventory_movements.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_inventory_movements.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_inventory_movements_created_at: string;
  /**
   * @evidence prisma:shopping_product_snapshots.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_id: string;
  /**
   * @evidence prisma:shopping_product_snapshots.product_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.product_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_product_id: string;
  /**
   * @evidence prisma:shopping_product_snapshots.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_seller_id: string;
  /**
   * @evidence prisma:shopping_product_snapshots.name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_name: string;
  /**
   * @evidence prisma:shopping_product_snapshots.description Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.description Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_description: string;
  /**
   * @evidence prisma:shopping_product_snapshots.category_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.category_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_category_id: string;
  /**
   * @evidence prisma:shopping_product_snapshots.base_price Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.base_price Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_base_price: number;
  /**
   * @evidence prisma:shopping_product_snapshots.aggregate Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.aggregate Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_aggregate: string;
  /**
   * @evidence prisma:shopping_product_snapshots.changed_fields Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.changed_fields Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_changed_fields: string;
  /**
   * @evidence prisma:shopping_product_snapshots.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_product_snapshots.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_product_snapshots_created_at: string;
  /**
   * @evidence prisma:shopping_wishlist_entries.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_wishlist_entries.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_wishlist_entries_id: string;
  /**
   * @evidence prisma:shopping_wishlist_entries.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_wishlist_entries.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_wishlist_entries_customer_id: string;
  /**
   * @evidence prisma:shopping_wishlist_entries.product_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_wishlist_entries.product_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_wishlist_entries_product_id: string;
  /**
   * @evidence prisma:shopping_wishlist_entries.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_wishlist_entries.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_wishlist_entries_created_at: string;
  /**
   * @evidence prisma:shopping_carts.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_carts.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_carts_id: string;
  /**
   * @evidence prisma:shopping_carts.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_carts.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_carts_customer_id: string;
  /**
   * @evidence prisma:shopping_carts.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_carts.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_carts_created_at: string;
  /**
   * @evidence prisma:shopping_carts.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_carts.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_carts_updated_at: string;
  /**
   * @evidence prisma:shopping_cart_lines.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cart_lines.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cart_lines_id: string;
  /**
   * @evidence prisma:shopping_cart_lines.cart_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cart_lines.cart_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cart_lines_cart_id: string;
  /**
   * @evidence prisma:shopping_cart_lines.variant_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cart_lines.variant_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cart_lines_variant_id: string;
  /**
   * @evidence prisma:shopping_cart_lines.quantity Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cart_lines.quantity Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cart_lines_quantity: number;
  /**
   * @evidence prisma:shopping_cart_lines.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cart_lines.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cart_lines_created_at: string;
  /**
   * @evidence prisma:shopping_cart_lines.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cart_lines.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cart_lines_updated_at: string;
  /**
   * @evidence prisma:shopping_orders.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_id: string;
  /**
   * @evidence prisma:shopping_orders.order_number Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.order_number Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_order_number: string;
  /**
   * @evidence prisma:shopping_orders.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_customer_id: string;
  /**
   * @evidence prisma:shopping_orders.purchased_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.purchased_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_purchased_at: string;
  /**
   * @evidence prisma:shopping_orders.total_price Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.total_price Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_total_price: number;
  /**
   * @evidence prisma:shopping_orders.shipping_recipient_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.shipping_recipient_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_shipping_recipient_name: string;
  /**
   * @evidence prisma:shopping_orders.shipping_recipient_phone Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.shipping_recipient_phone Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_shipping_recipient_phone: string;
  /**
   * @evidence prisma:shopping_orders.shipping_street_address Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.shipping_street_address Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_shipping_street_address: string;
  /**
   * @evidence prisma:shopping_orders.shipping_city Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.shipping_city Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_shipping_city: string;
  /**
   * @evidence prisma:shopping_orders.shipping_state_or_province Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.shipping_state_or_province Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_shipping_state_or_province: string;
  /**
   * @evidence prisma:shopping_orders.shipping_postal_code Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.shipping_postal_code Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_shipping_postal_code: string;
  /**
   * @evidence prisma:shopping_orders.shipping_country Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.shipping_country Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_shipping_country: string;
  /**
   * @evidence prisma:shopping_orders.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_orders.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_orders_created_at: string;
  /**
   * @evidence prisma:shopping_order_items.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_id: string;
  /**
   * @evidence prisma:shopping_order_items.order_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.order_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_order_id: string;
  /**
   * @evidence prisma:shopping_order_items.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_seller_id: string;
  /**
   * @evidence prisma:shopping_order_items.variant_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.variant_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_variant_id: string;
  /**
   * @evidence prisma:shopping_order_items.product_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.product_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_product_id: string;
  /**
   * @evidence prisma:shopping_order_items.product_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.product_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_product_name: string;
  /**
   * @evidence prisma:shopping_order_items.product_description Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.product_description Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_product_description: string;
  /**
   * @evidence prisma:shopping_order_items.sku_code Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.sku_code Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_sku_code: string;
  /**
   * @evidence prisma:shopping_order_items.option_values Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.option_values Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_option_values: string;
  /**
   * @evidence prisma:shopping_order_items.seller_shop_name Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.seller_shop_name Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_seller_shop_name: string;
  /**
   * @evidence prisma:shopping_order_items.seller_logo_image Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.seller_logo_image Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_seller_logo_image: string;
  /**
   * @evidence prisma:shopping_order_items.quantity Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.quantity Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_quantity: number;
  /**
   * @evidence prisma:shopping_order_items.unit_price Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.unit_price Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_unit_price: number;
  /**
   * @evidence prisma:shopping_order_items.status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_status: string;
  /**
   * @evidence prisma:shopping_order_items.purchased_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_items.purchased_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_items_purchased_at: string;
  /**
   * @evidence prisma:shopping_order_item_snapshots.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_item_snapshots.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_item_snapshots_id: string;
  /**
   * @evidence prisma:shopping_order_item_snapshots.order_item_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_item_snapshots.order_item_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_item_snapshots_order_item_id: string;
  /**
   * @evidence prisma:shopping_order_item_snapshots.kind Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_item_snapshots.kind Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_item_snapshots_kind: string;
  /**
   * @evidence prisma:shopping_order_item_snapshots.before_state Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_item_snapshots.before_state Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_item_snapshots_before_state: string;
  /**
   * @evidence prisma:shopping_order_item_snapshots.after_state Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_item_snapshots.after_state Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_item_snapshots_after_state: string;
  /**
   * @evidence prisma:shopping_order_item_snapshots.payload Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_item_snapshots.payload Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_item_snapshots_payload: string;
  /**
   * @evidence prisma:shopping_order_item_snapshots.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_order_item_snapshots.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_order_item_snapshots_created_at: string;
  /**
   * @evidence prisma:shopping_payment_attempts.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_id: string;
  /**
   * @evidence prisma:shopping_payment_attempts.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_customer_id: string;
  /**
   * @evidence prisma:shopping_payment_attempts.idempotency_key Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.idempotency_key Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_idempotency_key: string;
  /**
   * @evidence prisma:shopping_payment_attempts.status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_status: string;
  /**
   * @evidence prisma:shopping_payment_attempts.amount Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.amount Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_amount: number;
  /**
   * @evidence prisma:shopping_payment_attempts.gateway_reference Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.gateway_reference Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_gateway_reference: string;
  /**
   * @evidence prisma:shopping_payment_attempts.detail Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.detail Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_detail: string;
  /**
   * @evidence prisma:shopping_payment_attempts.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_created_at: string;
  /**
   * @evidence prisma:shopping_payment_attempts.completed_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_payment_attempts.completed_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_payment_attempts_completed_at: string;
  /**
   * @evidence prisma:shopping_shipments.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipments.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipments_id: string;
  /**
   * @evidence prisma:shopping_shipments.order_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipments.order_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipments_order_id: string;
  /**
   * @evidence prisma:shopping_shipments.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipments.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipments_seller_id: string;
  /**
   * @evidence prisma:shopping_shipments.carrier Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipments.carrier Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipments_carrier: string;
  /**
   * @evidence prisma:shopping_shipments.tracking_number Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipments.tracking_number Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipments_tracking_number: string;
  /**
   * @evidence prisma:shopping_shipments.shipped_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipments.shipped_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipments_shipped_at: string;
  /**
   * @evidence prisma:shopping_shipments.delivered_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipments.delivered_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipments_delivered_at: string;
  /**
   * @evidence prisma:shopping_shipment_items.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipment_items.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipment_items_id: string;
  /**
   * @evidence prisma:shopping_shipment_items.shipment_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipment_items.shipment_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipment_items_shipment_id: string;
  /**
   * @evidence prisma:shopping_shipment_items.order_item_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_shipment_items.order_item_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_shipment_items_order_item_id: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_id: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.order_item_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.order_item_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_order_item_id: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_customer_id: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_seller_id: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_reason: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_status: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_created_at: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.decided_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.decided_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_decided_at: string;
  /**
   * @evidence prisma:shopping_cancellation_requests.decided_by Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_requests.decided_by Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_requests_decided_by: string;
  /**
   * @evidence prisma:shopping_cancellation_snapshots.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_snapshots.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_snapshots_id: string;
  /**
   * @evidence prisma:shopping_cancellation_snapshots.request_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_snapshots.request_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_snapshots_request_id: string;
  /**
   * @evidence prisma:shopping_cancellation_snapshots.reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_snapshots.reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_snapshots_reason: string;
  /**
   * @evidence prisma:shopping_cancellation_snapshots.before_status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_snapshots.before_status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_snapshots_before_status: string;
  /**
   * @evidence prisma:shopping_cancellation_snapshots.after_status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_snapshots.after_status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_snapshots_after_status: string;
  /**
   * @evidence prisma:shopping_cancellation_snapshots.decided_by Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_snapshots.decided_by Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_snapshots_decided_by: string;
  /**
   * @evidence prisma:shopping_cancellation_snapshots.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_cancellation_snapshots.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_cancellation_snapshots_created_at: string;
  /**
   * @evidence prisma:shopping_refund_requests.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_id: string;
  /**
   * @evidence prisma:shopping_refund_requests.order_item_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.order_item_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_order_item_id: string;
  /**
   * @evidence prisma:shopping_refund_requests.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_customer_id: string;
  /**
   * @evidence prisma:shopping_refund_requests.seller_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.seller_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_seller_id: string;
  /**
   * @evidence prisma:shopping_refund_requests.reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_reason: string;
  /**
   * @evidence prisma:shopping_refund_requests.status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_status: string;
  /**
   * @evidence prisma:shopping_refund_requests.deadline_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.deadline_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_deadline_at: string;
  /**
   * @evidence prisma:shopping_refund_requests.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_created_at: string;
  /**
   * @evidence prisma:shopping_refund_requests.decided_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.decided_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_decided_at: string;
  /**
   * @evidence prisma:shopping_refund_requests.decided_by Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_requests.decided_by Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_requests_decided_by: string;
  /**
   * @evidence prisma:shopping_refund_snapshots.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_snapshots.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_snapshots_id: string;
  /**
   * @evidence prisma:shopping_refund_snapshots.request_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_snapshots.request_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_snapshots_request_id: string;
  /**
   * @evidence prisma:shopping_refund_snapshots.reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_snapshots.reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_snapshots_reason: string;
  /**
   * @evidence prisma:shopping_refund_snapshots.before_status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_snapshots.before_status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_snapshots_before_status: string;
  /**
   * @evidence prisma:shopping_refund_snapshots.after_status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_snapshots.after_status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_snapshots_after_status: string;
  /**
   * @evidence prisma:shopping_refund_snapshots.decided_by Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_snapshots.decided_by Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_snapshots_decided_by: string;
  /**
   * @evidence prisma:shopping_refund_snapshots.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_refund_snapshots.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_refund_snapshots_created_at: string;
  /**
   * @evidence prisma:shopping_reviews.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_id: string;
  /**
   * @evidence prisma:shopping_reviews.customer_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.customer_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_customer_id: string;
  /**
   * @evidence prisma:shopping_reviews.product_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.product_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_product_id: string;
  /**
   * @evidence prisma:shopping_reviews.order_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.order_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_order_id: string;
  /**
   * @evidence prisma:shopping_reviews.rating Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.rating Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_rating: number;
  /**
   * @evidence prisma:shopping_reviews.text Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.text Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_text: string;
  /**
   * @evidence prisma:shopping_reviews.published_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.published_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_published_at: string;
  /**
   * @evidence prisma:shopping_reviews.updated_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.updated_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_updated_at: string;
  /**
   * @evidence prisma:shopping_reviews.deleted_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.deleted_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_deleted_at: string;
  /**
   * @evidence prisma:shopping_reviews.anonymized Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_reviews.anonymized Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_reviews_anonymized: boolean;
  /**
   * @evidence prisma:shopping_review_snapshots.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_review_snapshots.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_review_snapshots_id: string;
  /**
   * @evidence prisma:shopping_review_snapshots.review_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_review_snapshots.review_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_review_snapshots_review_id: string;
  /**
   * @evidence prisma:shopping_review_snapshots.before_rating Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_review_snapshots.before_rating Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_review_snapshots_before_rating: string;
  /**
   * @evidence prisma:shopping_review_snapshots.after_rating Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_review_snapshots.after_rating Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_review_snapshots_after_rating: string;
  /**
   * @evidence prisma:shopping_review_snapshots.before_text Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_review_snapshots.before_text Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_review_snapshots_before_text: string;
  /**
   * @evidence prisma:shopping_review_snapshots.after_text Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_review_snapshots.after_text Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_review_snapshots_after_text: string;
  /**
   * @evidence prisma:shopping_review_snapshots.changed_fields Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_review_snapshots.changed_fields Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_review_snapshots_changed_fields: string;
  /**
   * @evidence prisma:shopping_review_snapshots.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_review_snapshots.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_review_snapshots_created_at: string;
  /**
   * @evidence prisma:shopping_administrator_requests.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_requests.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_requests_id: string;
  /**
   * @evidence prisma:shopping_administrator_requests.actor_type Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_requests.actor_type Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_requests_actor_type: string;
  /**
   * @evidence prisma:shopping_administrator_requests.actor_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_requests.actor_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_requests_actor_id: string;
  /**
   * @evidence prisma:shopping_administrator_requests.reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_requests.reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_requests_reason: string;
  /**
   * @evidence prisma:shopping_administrator_requests.status Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_requests.status Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_requests_status: string;
  /**
   * @evidence prisma:shopping_administrator_requests.decided_by Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_requests.decided_by Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_requests_decided_by: string;
  /**
   * @evidence prisma:shopping_administrator_requests.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_requests.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_requests_created_at: string;
  /**
   * @evidence prisma:shopping_administrator_requests.decided_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_administrator_requests.decided_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_administrator_requests_decided_at: string;
  /**
   * @evidence prisma:shopping_moderation_events.id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_id: string;
  /**
   * @evidence prisma:shopping_moderation_events.administrator_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.administrator_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_administrator_id: string;
  /**
   * @evidence prisma:shopping_moderation_events.target_type Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.target_type Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_target_type: string;
  /**
   * @evidence prisma:shopping_moderation_events.target_id Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.target_id Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_target_id: string;
  /**
   * @evidence prisma:shopping_moderation_events.action Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.action Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_action: string;
  /**
   * @evidence prisma:shopping_moderation_events.reason Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.reason Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_reason: string;
  /**
   * @evidence prisma:shopping_moderation_events.before_state Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.before_state Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_before_state: string;
  /**
   * @evidence prisma:shopping_moderation_events.after_state Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.after_state Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_after_state: string;
  /**
   * @evidence prisma:shopping_moderation_events.created_at Carries this persisted value at the public boundary.
   * @evidenceReview prisma:shopping_moderation_events.created_at Compared this public schema field with the cited Prisma column and verified the representation.
   */
  shopping_moderation_events_created_at: string;
}
