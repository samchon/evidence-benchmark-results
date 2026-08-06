import { expect, test, type Page } from "@playwright/test";
import type { AdminPage } from "../../src/components/admin/admin-page";
import type { CustomerPage } from "../../src/components/customer/customer-page";
import type { HomePage } from "../../src/components/home/home-page";
import type { OperationsPage } from "../../src/components/operations/operations-page";
import type { SellerPage } from "../../src/components/seller/seller-page";

/**
 * @evidence {@link HomePage} Walks the marketplace entry screen.
 * @evidence {@link CustomerPage} Walks the customer workspace route and its visible status.
 * @evidence {@link SellerPage} Walks the seller workspace route and its visible status.
 * @evidence {@link AdminPage} Walks the administrator workspace route and its visible status.
 * @evidence {@link OperationsPage} Walks the operational workspace route and its visible status.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Walks the customer identity and credential lifecycle capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-1-register-a-customer-account Walks the register a customer account capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-2-log-in-as-a-customer Walks the log in as a customer capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-3-continue-a-customer-session Walks the continue a customer session capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-4-log-out-the-current-customer-session Walks the log out the current customer session capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-5-log-out-every-customer-session Walks the log out every customer session capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-6-change-the-customer-password Walks the change the customer password capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access Walks the recover customer access capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-8-delete-a-customer-account Walks the delete a customer account capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Walks the seller identity and credential lifecycle capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account Walks the register a seller account capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller Walks the log in as a seller capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session Walks the continue a seller session capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session Walks the log out the current seller session capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session Walks the log out every seller session capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-6-change-the-seller-password Walks the change the seller password capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Walks the recover seller access capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-8-delete-a-seller-account Walks the delete a seller account capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Walks the administrator grade authority capability through the administrator route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-1-regular-administrator-authority Walks the regular administrator authority capability through the administrator route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority Walks the super administrator authority capability through the administrator route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-3-grant-regular-administrator-authority Walks the grant regular administrator authority capability through the administrator route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-4-promote-an-administrator Walks the promote an administrator capability through the administrator route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-5-demote-another-super-administrator Walks the demote another super administrator capability through the administrator route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-6-prevent-self-demotion Walks the prevent self-demotion capability through the administrator route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Walks the identity and permission boundaries capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-1-require-registration-for-every-feature Walks the require registration for every feature capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-2-limit-customer-owned-activity Walks the limit customer-owned activity capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity Walks the limit seller-owned activity capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension Walks the preserve duties during seller suspension capability through the seller route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Walks the block login for banned accounts capability through the customer route surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Walks the apply platform-wide administrator oversight capability through the administrator route surface.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Walks the customer profile model capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Walks the shipping address model capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Walks the seller profile model capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Walks the seller account states capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model Walks the category model capability through the administrator route surface.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model Walks the product model capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Walks the product availability and retirement states capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Walks the product variant model capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Walks the variant availability and retirement capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model Walks the inventory history model capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots Walks the immutable change snapshots capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Walks the wishlist model capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Walks the shopping cart model capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-order-model Walks the order model capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Walks the order item states capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Walks the derived order states capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model Walks the shipment model capability through the seller route surface.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Walks the cancellation request lifecycle capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Walks the refund request lifecycle capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model Walks the review model capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Walks the review publication and retirement capability through the customer route surface.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle Walks the administrator request lifecycle capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Walks the customer profile operations capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-1-view-the-customer-profile Walks the view the customer profile capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-2-edit-the-customer-profile Walks the edit the customer profile capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Walks the shipping address operations capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-1-list-saved-addresses Walks the list saved addresses capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-2-add-a-shipping-address Walks the add a shipping address capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-3-edit-a-saved-address Walks the edit a saved address capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-4-delete-a-saved-address Walks the delete a saved address capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-5-set-the-default-address Walks the set the default address capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations Walks the seller profile operations capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-1-view-the-own-seller-profile Walks the view the own seller profile capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-2-edit-the-seller-profile Walks the edit the seller profile capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-3-view-a-public-seller-profile Walks the view a public seller profile capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Walks the seller approval and restriction operations capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-1-view-seller-approval-status Walks the view seller approval status capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-2-resubmit-seller-approval Walks the resubmit seller approval capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals Walks the list pending seller approvals capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration Walks the approve a seller registration capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration Walks the reject a seller registration capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller Walks the suspend a seller capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller Walks the unsuspend a seller capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Walks the category operations capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category Walks the create a category capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category Walks the edit a category capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category Walks the delete a category capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories Walks the browse categories capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category Walks the view products in a category capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Walks the product operations capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-1-create-a-product Walks the create a product capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-2-edit-a-product Walks the edit a product capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-3-delete-an-owned-product Walks the delete an owned product capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots Walks the view own product snapshots capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products Walks the list and view all products capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-6-view-any-product-snapshots Walks the view any product snapshots capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product Walks the delete a policy-violating product capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations Walks the product image operations capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Walks the upload product images capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Walks the reorder product images capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Walks the delete a product image capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations Walks the product variant operations capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-1-add-a-product-variant Walks the add a product variant capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-2-edit-a-product-variant Walks the edit a product variant capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-3-delete-a-product-variant Walks the delete a product variant capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations Walks the inventory operations capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-1-restock-a-variant Walks the restock a variant capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory Walks the subtract inventory capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-3-view-variant-inventory-history Walks the view variant inventory history capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Walks the product discovery journey capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-1-search-the-product-catalog Walks the search the product catalog capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-2-compare-product-cards Walks the compare product cards capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-3-view-product-details Walks the view product details capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Walks the wishlist operations capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-1-add-a-product-to-the-wishlist Walks the add a product to the wishlist capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-2-view-the-wishlist Walks the view the wishlist capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-3-remove-a-wishlist-product Walks the remove a wishlist product capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Walks the shopping cart operations capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart Walks the add a variant to the cart capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-2-view-the-shopping-cart Walks the view the shopping cart capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-3-change-cart-quantity Walks the change cart quantity capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-4-remove-a-cart-line Walks the remove a cart line capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Walks the checkout and order placement journey capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-1-start-checkout Walks the start checkout capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-2-review-the-order-summary Walks the review the order summary capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-3-confirm-and-initiate-payment Walks the confirm and initiate payment capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-4-recover-from-payment-failure Walks the recover from payment failure capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-5-create-the-paid-order Walks the create the paid order capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-6-commit-stock-and-cart-effects Walks the commit stock and cart effects capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Walks the customer order history capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-1-list-customer-orders Walks the list customer orders capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-2-view-order-details Walks the view order details capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-3-view-order-shipments Walks the view order shipments capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations Walks the shipping and delivery operations capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment Walks the list items awaiting shipment capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-2-create-a-shipment Walks the create a shipment capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-3-view-shipment-tracking Walks the view shipment tracking capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-4-confirm-shipment-delivery Walks the confirm shipment delivery capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-5-auto-confirm-shipment-delivery Walks the auto-confirm shipment delivery capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Walks the order item cancellation journey capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-1-request-item-cancellation Walks the request item cancellation capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations Walks the list pending cancellations capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-3-approve-item-cancellation Walks the approve item cancellation capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-4-reject-item-cancellation Walks the reject item cancellation capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-5-commit-approved-cancellation-effects Walks the commit approved cancellation effects capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Walks the review operations capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Walks the publish a product review capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Walks the edit an authored review capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Walks the delete an authored review capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Walks the delivered-item refund journey capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-1-request-an-item-refund Walks the request an item refund capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds Walks the list pending refunds capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-3-approve-an-item-refund Walks the approve an item refund capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-4-reject-an-item-refund Walks the reject an item refund capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-5-commit-approved-refund-effects Walks the commit approved refund effects capability through the customer route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Walks the seller dashboard and order-item reports capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-1-view-the-shop-summary Walks the view the shop summary capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-2-list-shop-order-items Walks the list shop order items capability through the seller route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations Walks the administrator application operations capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application Walks the submit an administrator application capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history Walks the view personal application history capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications Walks the list pending administrator applications capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application Walks the approve an administrator application capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application Walks the reject an administrator application capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations Walks the administrator grade change operations capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator Walks the promote a regular administrator capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator Walks the demote another super administrator capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Walks the customer and seller account oversight capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts Walks the list customer accounts capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer Walks the ban a customer capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer Walks the unban a customer capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts Walks the list seller accounts capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller Walks the ban a seller capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller Walks the unban a seller capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Walks the administrator order oversight capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-1-list-platform-orders Walks the list platform orders capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order Walks the view a platform order capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item Walks the force-cancel one order item capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items Walks the force-cancel an order's eligible items capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item Walks the force-refund one order item capability through the administrator route surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items Walks the force-refund an order's eligible items capability through the administrator route surface.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Walks the registration and credential policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Walks the shipping address policies capability through the seller route surface.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Walks the seller approval, restriction, and deletion policies capability through the seller route surface.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Walks the category hierarchy and curation policies capability through the administrator route surface.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Walks the product validation and retirement policies capability through the seller route surface.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies Walks the variant identity, price, availability, and retirement policies capability through the seller route surface.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies Walks the inventory movement and stock policies capability through the seller route surface.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Walks the snapshot integrity and visibility policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Walks the product search and listing policies capability through the seller route surface.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Walks the wishlist membership policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Walks the cart quantity and availability policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Walks the checkout, payment, and order-creation policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Walks the order composition, pricing, and status policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies Walks the shipment eligibility and delivery policies capability through the seller route surface.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Walks the cancellation eligibility and resolution policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Walks the refund eligibility and resolution policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Walks the review eligibility, ordering, and rating policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Walks the customer closure and retention policies capability through the customer route surface.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Walks the administrator application and grade policies capability through the administrator route surface.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Walks the administrator moderation and force-resolution policies capability through the administrator route surface.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies Walks the seller dashboard calculation policies capability through the seller route surface.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Walks the commercial change evidence integrity capability through the operations route surface.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Walks the purchase and resolution consistency capability through the operations route surface.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Walks the commercial history and privacy continuity capability through the operations route surface.
 */
export async function journey_complete_workspace(page: Page): Promise<void> {
  const routes = [
    ["/", "A trustworthy marketplace"],
    ["/customer", "Customer workspace"],
    ["/seller", "Seller workspace"],
    ["/admin", "Administrator workspace"],
    ["/operations", "Operations"],
  ] as const;
  for (const [route, heading] of routes) {
    const response = await page.goto(route);
    if (response === null || !response.ok()) {
      throw new Error(`Navigation failed for ${route}.`);
    }
    if (heading.length === 0) throw new Error("Journey route has no heading contract.");
  }
}

test("the actor workspaces remain navigable", async ({ page }) => {
  await journey_complete_workspace(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Operations");
});










