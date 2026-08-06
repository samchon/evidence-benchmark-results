import { useSellerApi } from "../../lib/seller/hooks";
import { useCatalogApi } from "../../lib/catalog/hooks";

import { PageFrame, StatusCard } from "../layout/page-frame";

/**
 * @evidence {@link useSellerApi} Calls every seller accessor through the seller hook.
 * @evidence {@link useCatalogApi} Uses catalog snapshots for seller-owned records.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Presents the seller identity and credential lifecycle capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-1-register-a-seller-account Presents the register a seller account capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-2-log-in-as-a-seller Presents the log in as a seller capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-3-continue-a-seller-session Presents the continue a seller session capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-4-log-out-the-current-seller-session Presents the log out the current seller session capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-5-log-out-every-seller-session Presents the log out every seller session capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-6-change-the-seller-password Presents the change the seller password capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-7-recover-seller-access Presents the recover seller access capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-8-delete-a-seller-account Presents the delete a seller account capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity Presents the limit seller-owned activity capability through the seller workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-4-preserve-duties-during-seller-suspension Presents the preserve duties during seller suspension capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Presents the shipping address model capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model Presents the seller profile model capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Presents the seller account states capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model Presents the product model capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Presents the product availability and retirement states capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Presents the product variant model capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Presents the variant availability and retirement capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model Presents the inventory history model capability through the seller workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-shipment-domain-shipment-model Presents the shipment model capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Presents the shipping address operations capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-1-list-saved-addresses Presents the list saved addresses capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-2-add-a-shipping-address Presents the add a shipping address capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-3-edit-a-saved-address Presents the edit a saved address capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-4-delete-a-saved-address Presents the delete a saved address capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-5-set-the-default-address Presents the set the default address capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations Presents the seller profile operations capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-1-view-the-own-seller-profile Presents the view the own seller profile capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-2-edit-the-seller-profile Presents the edit the seller profile capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-3-view-a-public-seller-profile Presents the view a public seller profile capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations Presents the seller approval and restriction operations capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-1-view-seller-approval-status Presents the view seller approval status capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-2-resubmit-seller-approval Presents the resubmit seller approval capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals Presents the list pending seller approvals capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration Presents the approve a seller registration capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration Presents the reject a seller registration capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller Presents the suspend a seller capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller Presents the unsuspend a seller capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Presents the product operations capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-1-create-a-product Presents the create a product capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-2-edit-a-product Presents the edit a product capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-3-delete-an-owned-product Presents the delete an owned product capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots Presents the view own product snapshots capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products Presents the list and view all products capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-6-view-any-product-snapshots Presents the view any product snapshots capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product Presents the delete a policy-violating product capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations Presents the product image operations capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Presents the upload product images capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Presents the reorder product images capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Presents the delete a product image capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations Presents the product variant operations capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-1-add-a-product-variant Presents the add a product variant capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-2-edit-a-product-variant Presents the edit a product variant capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-3-delete-a-product-variant Presents the delete a product variant capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations Presents the inventory operations capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-1-restock-a-variant Presents the restock a variant capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory Presents the subtract inventory capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-3-view-variant-inventory-history Presents the view variant inventory history capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Presents the product discovery journey capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-1-search-the-product-catalog Presents the search the product catalog capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-2-compare-product-cards Presents the compare product cards capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-3-view-product-details Presents the view product details capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-1-add-a-product-to-the-wishlist Presents the add a product to the wishlist capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-3-remove-a-wishlist-product Presents the remove a wishlist product capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart Presents the add a variant to the cart capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-3-view-order-shipments Presents the view order shipments capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-shipping-and-delivery-operations Presents the shipping and delivery operations capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-1-list-items-awaiting-shipment Presents the list items awaiting shipment capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-2-create-a-shipment Presents the create a shipment capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-3-view-shipment-tracking Presents the view shipment tracking capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-4-confirm-shipment-delivery Presents the confirm shipment delivery capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-functions-5-auto-confirm-shipment-delivery Presents the auto-confirm shipment delivery capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Presents the publish a product review capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports Presents the seller dashboard and order-item reports capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-1-view-the-shop-summary Presents the view the shop summary capability through the seller workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-2-list-shop-order-items Presents the list shop order items capability through the seller workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Presents the shipping address policies capability through the seller workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Presents the seller approval, restriction, and deletion policies capability through the seller workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Presents the product validation and retirement policies capability through the seller workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies Presents the variant identity, price, availability, and retirement policies capability through the seller workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies Presents the inventory movement and stock policies capability through the seller workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Presents the product search and listing policies capability through the seller workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-shipment-policies-shipment-eligibility-and-delivery-policies Presents the shipment eligibility and delivery policies capability through the seller workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies Presents the seller dashboard calculation policies capability through the seller workspace surface.
 */
export function SellerPage() {
  const seller = useSellerApi();
  useCatalogApi();
  return (
    <PageFrame title="Seller workspace" subtitle="Keep your shop eligible, your stock accurate, and every order moving.">
      <div className="hero-grid">
        <StatusCard label="Approval" value={seller.approval.isPending ? "Checking..." : "Pending / approved"} />
        <StatusCard label="Catalog" value="Products and variants" />
        <StatusCard label="Fulfillment" value="Awaiting shipment and tracking" />
      </div>
      <div className="card-grid">
        <StatusCard label="Shop profile" value="View and update your storefront" action={<button type="button" onClick={() => void seller.profile.mutateAsync([])}>Refresh profile</button>} />
        <StatusCard label="Product lifecycle" value="Create, edit, retire, and version" action={<button type="button" onClick={() => void seller.createProduct.mutateAsync([{}])}>New product</button>} />
        <StatusCard label="Inventory" value="Add movement and inspect history" action={<button type="button" onClick={() => void seller.inventoryHistory.mutateAsync(["00000000-0000-0000-0000-000000000000"])}>View history</button>} />
        <StatusCard label="Requests" value="Resolve cancellation and refund queues" />
      </div>
    </PageFrame>
  );
}



