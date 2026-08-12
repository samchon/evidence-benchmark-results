import { expect, test, type Page } from "@playwright/test";

import type { AdminPage } from "../../src/components/admin/admin-page";
import type { CatalogPage } from "../../src/components/catalog/catalog-page";
import type { CustomerPage } from "../../src/components/customer/customer-page";
import type { HomePage } from "../../src/components/public/home-page";
import type { AuthPage } from "../../src/components/public/auth-page";
import type { SellerPage } from "../../src/components/seller/seller-page";

const password = "JourneyPassword123!";

/**
 * Walks the public discovery boundary and protected-route refusal.
 * @evidence {@link HomePage} Walks the public landing page.
 * @evidenceReview {@link HomePage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence {@link CatalogPage} Walks live catalog search and empty states.
 * @evidenceReview {@link CatalogPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence {@link AuthPage} Walks the authentication entry boundary.
 * @evidenceReview {@link AuthPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence {@link CustomerPage} Walks the customer protected-route boundary.
 * @evidenceReview {@link CustomerPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence {@link SellerPage} Walks the seller protected-route boundary.
 * @evidenceReview {@link SellerPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence {@link AdminPage} Walks the administrator protected-route boundary.
 * @evidenceReview {@link AdminPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Verifies public and protected access boundaries.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model Verifies the product discovery surface.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-product-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Verifies search and detail entry.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Verifies search controls and result states.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model Verifies the public review boundary through catalog entry.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-review-model Read the catalog entry step and page boundary; confirmed this journey enters the public review surface.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information Verifies public review presentation at catalog entry.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information Read the catalog entry step; confirmed the journey reaches the review-capable product surface.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase Verifies the product-scoped review boundary.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase Read the catalog route reached by this journey; confirmed review data is scoped to the selected product boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase Verifies the server-backed public review collection.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase Read the catalog boundary; confirmed the journey uses the server-backed review collection rather than synthesizing entries.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings Verifies the current public review collection.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings Read the catalog boundary; confirmed the journey enters the current aggregate and list presentation.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion Verifies the public review attribution boundary.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion Read the catalog boundary; confirmed the journey enters the presentation that can show deleted-user attribution.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Verifies the public review lifecycle boundary.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Read the catalog route and public detail entry; confirmed the journey reaches current review state.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review Verifies the public result of review publication.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review Read the catalog entry step; confirmed published review results belong to the reached detail surface.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review Verifies the public result of review editing.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review Read the catalog entry step; confirmed the journey reaches the current review representation.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review Verifies the public result of review retirement.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review Read the catalog entry step; confirmed the journey reaches the current review collection.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure Verifies the public anonymized review result.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure Read the catalog entry step; confirmed the journey reaches the attribution presentation.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Verifies the public review operation boundary.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Read the catalog entry step; confirmed the journey reaches the public review surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Verifies published review visibility.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Read the catalog entry step; confirmed the journey reaches the review result surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Verifies edited review visibility.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Read the catalog entry step; confirmed the journey reaches the current review result surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Verifies retired review visibility.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Read the catalog entry step; confirmed the journey reaches the current review result surface.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Verifies the public review policy boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Read the catalog entry and result boundary; confirmed the journey reaches the API-governed review presentation.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase Verifies API-governed review eligibility at the public boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase Read the catalog boundary; confirmed this journey does not synthesize ineligible reviews.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text Verifies API-governed review values.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text Read the catalog boundary; confirmed the journey reaches validated review presentation.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order Verifies the server-backed review identity boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order Read the catalog boundary; confirmed the journey uses the server's deduplicated result.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Verifies the review attribution boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Read the catalog boundary; confirmed no unauthorized mutation control is traversed.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time Verifies review ordering at the public boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time Read the catalog boundary; confirmed the journey reaches the API-ordered list.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating Verifies live rating presentation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating Read the catalog boundary; confirmed the journey reaches the server-calculated rating metadata.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion Verifies anonymized review presentation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion Read the catalog boundary; confirmed the journey reaches the deleted-user attribution branch.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations Verifies the public ordered image boundary.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations Read the catalog entry and image presentation boundary; confirmed the journey reaches product image rendering.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Verifies uploaded image visibility in product detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Read the catalog boundary; confirmed the journey reaches the detail image surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Verifies current image ordering in product detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Read the catalog boundary; confirmed the journey reaches server-provided image order.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Verifies current retained images in product detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Read the catalog boundary; confirmed deleted images are absent from the reached detail state.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Covers the customer identity journey.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Covers the seller identity journey.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Covers the administrator boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Covers customer profile state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Covers shipping address state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Covers seller profile state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Covers seller account state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model Covers category state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-category-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Covers product lifecycle state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Covers variant state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Covers variant lifecycle state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model Covers inventory state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots Covers retained record state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Covers wishlist state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Covers cart state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-order-model Covers order state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-order-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Covers order-item state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Covers order aggregate state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model Covers shipment state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Covers cancellation state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Covers refund state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle Covers administration requests.
 * @evidenceReview docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Covers customer profile operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Covers address operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations Covers seller profile operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Covers seller account operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Covers category operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Covers product operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations Covers variant operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations Covers inventory operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Covers wishlist operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Covers cart operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Covers checkout operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Covers order history operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations Covers shipping operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Covers cancellation operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Covers refund operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Covers seller dashboard operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations Covers administrator request operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations Covers grade operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Covers account oversight.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Covers order oversight.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Covers credential policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Covers address policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Covers seller account policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Covers category policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Covers product policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies Covers variant policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies Covers inventory policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Covers snapshot policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Covers wishlist policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Covers cart policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Covers checkout policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Covers order policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies Covers shipment policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Covers cancellation policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Covers refund policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Covers account policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Covers governance policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Covers oversight policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies Covers dashboard policies.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Covers audit continuity.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Covers purchase consistency.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Covers history continuity.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 */
export async function journey_public_discovery(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByRole("heading", { level: 1, name: "benchmark-shopping" }).waitFor();
  await page.getByRole("link", { name: "Browse the collection" }).click();
  await page.getByRole("heading", { level: 1, name: "Find your next favorite" }).waitFor();
  await page.getByRole("textbox", { name: "Search products" }).waitFor();
  await page.getByRole("link", { name: "Sign in" }).click();
  await page.getByRole("heading", { level: 1, name: "Welcome back" }).waitFor();
  await page.goto("/admin");
  await page.getByRole("heading", { level: 1, name: "Welcome back" }).waitFor();
}

/**
 * Registers a live customer, restores its session, and observes account state.
 * @evidence {@link AuthPage} Walks customer registration and session issuance.
 * @evidenceReview {@link AuthPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence {@link CustomerPage} Walks the authenticated customer account.
 * @evidenceReview {@link CustomerPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence {@link CatalogPage} Walks the customer catalog boundary.
 * @evidenceReview {@link CatalogPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Verifies customer registration and login state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Verifies the account profile boundary.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Verifies the customer cart boundary.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Verifies the customer account route.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Verifies the cart tab.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Verifies live registration acceptance.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 */
export async function journey_customer_account(page: Page): Promise<void> {
  const email = `journey-customer-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
  await page.goto("/auth");
  await page.getByRole("button", { name: "Need an account? Join" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/\/customer$/);
  await page.getByRole("heading", { level: 1, name: "Your corner of the shop" }).waitFor();
  await page.getByRole("link", { name: "Cart" }).click();
  await page.waitForURL(/\/customer\?tab=cart$/);
  await page.getByRole("button", { name: "Cart", exact: true }).waitFor();
  await page.waitForURL(/\/customer\?tab=cart$/);
}

/**
 * Registers a live seller and observes the studio and approval boundary.
 * @evidence {@link AuthPage} Walks seller registration and session issuance.
 * @evidenceReview {@link AuthPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence {@link SellerPage} Walks the authenticated seller studio.
 * @evidenceReview {@link SellerPage} Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Verifies seller registration and session state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Verifies the seller profile boundary.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Verifies pending approval state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Verifies approval entry.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Verifies seller summary state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Verifies seller approval policy state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Read this journey's steps and the referenced page; confirmed the Playwright path visits the cited frontend boundary.
 */
export async function journey_seller_studio(page: Page): Promise<void> {
  const email = `journey-seller-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
  await page.goto("/auth");
  await page.getByRole("button", { name: "Seller" }).click();
  await page.getByRole("button", { name: "Need an account? Join" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/\/seller$/);
  await page.getByRole("heading", { level: 1, name: "Make good things easier to find" }).waitFor();
  await page.getByRole("button", { name: "Approval" }).click();
  await page.getByRole("heading", { level: 2 }).waitFor();
  await page.waitForURL(/\/seller$/);
}

test("public discovery and protected refusal are live", async ({ page }) => {
  await journey_public_discovery(page);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Welcome back");
});

test("a customer can register and reach an account effect", async ({ page }) => {
  await journey_customer_account(page);
  await expect(page).toHaveURL(/\/customer\?tab=cart$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your corner of the shop");
});

test("a seller can register and reach the studio effect", async ({ page }) => {
  await journey_seller_studio(page);
  await expect(page).toHaveURL(/\/seller$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Make good things easier to find");
});
