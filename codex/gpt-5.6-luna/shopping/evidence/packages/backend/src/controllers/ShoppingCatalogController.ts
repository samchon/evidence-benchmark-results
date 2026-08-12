import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IPage, IShoppingCategory, IShoppingCustomer, IShoppingProduct, IShoppingProductVariant, IShoppingReview, IShoppingSeller } from "@benchmark/shopping-api";
import { ShoppingCatalogProvider } from "../providers/ShoppingCatalogProvider";
import { ShoppingSessionProvider } from "../providers/ShoppingSessionProvider";
import { ShoppingSellerSessionProvider } from "../providers/ShoppingSellerSessionProvider";
import { ShoppingAfterSalesProvider } from "../providers/ShoppingAfterSalesProvider";
import { ShoppingAuthorityProvider } from "../providers/ShoppingAuthorityProvider";
import { ShoppingAdminProvider } from "../providers/ShoppingAdminProvider";

/** Publishes category and product discovery operations. */
@Controller("shopping")
export class ShoppingCatalogController {
  /** Browse the two-level category tree.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model Publishes the category model projection.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-category-model Reviewed the live hierarchy projection and deleted-category exclusion.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Publishes the category operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Reviewed the browse and curation routes together.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Applies category hierarchy and curation policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Reviewed the two-level tree and administrator guards.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-1-define-category-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-1-define-category-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_categories This operation exposes the persisted model shopping_categories.
 * @evidenceReview prisma:shopping_categories Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("category/list")
  public async categoryIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCategory.IRequest): Promise<IPage<IShoppingCategory>> { await ShoppingSessionProvider.customer(headers.Authorization); return ShoppingCatalogProvider.categoryIndex(input); }
  /** Create a category.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category Creates a category.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators Requires administrator authority.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels Enforces the category depth limit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("category/create")
  public async categoryCreate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingCategory.ICreate): Promise<IShoppingCategory> { await ShoppingAdminProvider.assertRegular(await ShoppingAuthorityProvider.actor(headers.Authorization)); return ShoppingCatalogProvider.categoryCreate(input); }
    /** Read a category.
     * @evidence docs/analysis/02-domain-model.md#req-category-domain-3-classify-a-product Reads the live category relationship used by products.
     * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-3-classify-a-product Reviewed the live-category lookup and deleted-category refusal.
     */
  @core.TypedRoute.Get("category/detail/:id")
  public async categoryAt(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCategory> { await ShoppingSessionProvider.customer(headers.Authorization); return ShoppingCatalogProvider.categoryAt(id); }
  /** Edit a category.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category Edits a category.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators Requires administrator authority.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels Enforces the category depth limit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("category/update/:id")
  public async categoryUpdate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingCategory.IUpdate): Promise<IShoppingCategory> { await ShoppingAdminProvider.assertRegular(await ShoppingAuthorityProvider.actor(headers.Authorization)); return ShoppingCatalogProvider.categoryUpdate(id, input); }
  /** Retire a category and uncategorize its products.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category Retires a category.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-4-uncategorize-products-when-taxonomy-is-retired Clears the category from products.
 * @evidenceReview docs/analysis/04-business-rules.md#req-category-policies-4-uncategorize-products-when-taxonomy-is-retired Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Delete("category/delete/:id")
  public async categoryErase(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer.IResult> { await ShoppingAdminProvider.assertRegular(await ShoppingAuthorityProvider.actor(headers.Authorization)); return ShoppingCatalogProvider.categoryErase(id); }
  /** Search the live product catalog.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Publishes product availability and retirement states.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Reviewed live visibility, no-variant unavailability, suspension hiding, and terminal deletion.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category Applies direct category filtering to product discovery.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category Reviewed the category predicate and shared product-card projection.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Publishes the product-discovery operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Reviewed search, filtering, ordering, pagination, and visibility.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Applies the product-search and listing policy family.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Reviewed seller eligibility, filters, availability, and stable ordering.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-1-define-product-catalog-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-1-define-product-catalog-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-2-relate-a-product-to-its-seller This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-2-relate-a-product-to-its-seller Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-4-relate-variants-to-a-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-4-relate-variants-to-a-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-5-relate-products-to-discovery-and-history This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-5-relate-products-to-discovery-and-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-1-show-a-newly-created-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-1-show-a-newly-created-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-2-mark-a-product-unavailable-without-variants This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-2-mark-a-product-unavailable-without-variants Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-3-hide-products-during-seller-suspension This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-3-hide-products-during-seller-suspension Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-4-remove-live-product-relationships This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-4-remove-live-product-relationships Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-5-retain-history-after-product-deletion This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-5-retain-history-after-product-deletion Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-1-define-variant-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-1-define-variant-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-2-relate-a-variant-to-its-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-2-relate-a-variant-to-its-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-3-resolve-the-effective-variant-price This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-3-resolve-the-effective-variant-price Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-4-calculate-variant-stock This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-4-calculate-variant-stock Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-5-use-variants-as-commerce-units This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-5-use-variants-as-commerce-units Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-1-define-change-snapshots This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-1-define-change-snapshots Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-2-keep-snapshots-immutable This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-2-keep-snapshots-immutable Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-3-capture-complete-product-state This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-3-capture-complete-product-state Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-4-capture-other-mutable-evidence This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-4-capture-other-mutable-evidence Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-5-capture-purchase-time-item-state This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-5-capture-purchase-time-item-state Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-6-retain-evidence-after-live-deletion This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-6-retain-evidence-after-live-deletion Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-7-limit-snapshot-visibility This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-7-limit-snapshot-visibility Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-1-relate-a-wishlist-to-its-customer-and-products This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-1-relate-a-wishlist-to-its-customer-and-products Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-2-keep-one-entry-per-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-2-keep-one-entry-per-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-3-remove-deleted-products-from-wishlists This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-3-remove-deleted-products-from-wishlists Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-1-create-a-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-1-create-a-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-2-edit-a-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-2-edit-a-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-3-delete-an-owned-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-3-delete-an-owned-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-6-view-any-product-snapshots This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-6-view-any-product-snapshots Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-1-add-a-product-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-1-add-a-product-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-2-edit-a-product-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-2-edit-a-product-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-3-delete-a-product-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-3-delete-a-product-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-1-search-the-product-catalog This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-1-search-the-product-catalog Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-2-compare-product-cards This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-2-compare-product-cards Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-3-view-product-details This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-3-view-product-details Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-1-add-a-product-to-the-wishlist This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-1-add-a-product-to-the-wishlist Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-3-remove-a-wishlist-product This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-3-remove-a-wishlist-product Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-1-keep-one-identity-per-canonical-email-and-account-type This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-1-keep-one-identity-per-canonical-email-and-account-type Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-2-refuse-duplicate-registration This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-2-refuse-duplicate-registration Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-3-require-current-password-proof-for-password-change This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-3-require-current-password-proof-for-password-change Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-4-block-unavailable-identities This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-4-block-unavailable-identities Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-2-enforce-address-ownership This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-2-enforce-address-ownership Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-3-keep-at-most-one-default-address This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-3-keep-at-most-one-default-address Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-1-require-valid-product-catalog-data This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-1-require-valid-product-catalog-data Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-2-enforce-product-ownership This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-2-enforce-product-ownership Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-3-snapshot-the-complete-aggregate-on-catalog-edit This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-3-snapshot-the-complete-aggregate-on-catalog-edit Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-4-block-seller-product-deletion-during-fulfillment This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-4-block-seller-product-deletion-during-fulfillment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-5-block-seller-product-deletion-during-unresolved-requests This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-5-block-seller-product-deletion-during-unresolved-requests Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-6-retire-violating-merchandise-without-stranding-obligations This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-6-retire-violating-merchandise-without-stranding-obligations Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-1-create-evidence-for-covered-commercial-changes This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-1-create-evidence-for-covered-commercial-changes Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-2-capture-the-complete-product-aggregate This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-2-capture-the-complete-product-aggregate Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-4-keep-snapshots-immutable-and-undeletable This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-4-keep-snapshots-immutable-and-undeletable Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-5-limit-snapshot-evidence-to-relevant-parties This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-5-limit-snapshot-evidence-to-relevant-parties Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-1-search-the-eligible-cross-seller-catalog This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-1-search-the-eligible-cross-seller-catalog Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-2-combine-product-search-constraints This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-2-combine-product-search-constraints Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-3-order-and-page-search-results-deterministically This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-3-order-and-page-search-results-deterministically Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-4-render-the-standard-product-card This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-4-render-the-standard-product-card Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-2-admit-one-live-product-entry-per-customer This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-2-admit-one-live-product-entry-per-customer Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-3-keep-a-wishlist-entry-product-scoped-and-nonreserving This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-3-keep-a-wishlist-entry-product-scoped-and-nonreserving Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-4-page-retained-wishlist-products-consistently This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-4-page-retained-wishlist-products-consistently Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-1-authenticate-irreversible-customer-closure This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-1-authenticate-irreversible-customer-closure Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-2-remove-working-personal-customer-state This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-2-remove-working-personal-customer-state Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-5-keep-customer-closure-permanent This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-5-keep-customer-closure-permanent Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-1-count-the-sellers-current-products This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-seller-dashboard-policies-1-count-the-sellers-current-products Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-3-preserve-a-complete-product-time-point This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-audit-integrity-3-preserve-a-complete-product-time-point Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_products This operation exposes the persisted model shopping_products.
 * @evidenceReview prisma:shopping_products Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_product_snapshots This operation exposes the persisted model shopping_product_snapshots.
 * @evidenceReview prisma:shopping_product_snapshots Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("product/search")
  public async productIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> { await ShoppingSessionProvider.customer(headers.Authorization); return ShoppingCatalogProvider.productIndex(input); }
  /** Read one product detail.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Publishes product detail discovery.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Reviewed the live aggregate and visibility guard.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model Exposes live review participation in product detail.
   * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-review-model Reviewed the non-deleted review projection and aggregate rating.
   * @tag Product */
  @core.TypedRoute.Get("product/detail/:id")
  public async productAt(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingProduct> { await ShoppingSessionProvider.customer(headers.Authorization); return ShoppingCatalogProvider.productAt(id); }
  /** List reviews shown for a product.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model Publishes the product review model projection.
   * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-review-model Reviewed live-review filtering and stable publication ordering.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings Excludes retired reviews from the live projection.
   * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings Reviewed the deleted_at filter and paged result.
   * @tag Review */
  @core.TypedRoute.Patch("product/reviews/:id")
  public async productReviews(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingReview.IRequest): Promise<IPage<IShoppingReview>> { return ShoppingAfterSalesProvider.reviewIndex(await ShoppingSessionProvider.customer(headers.Authorization), id, input); }
  /** List product snapshots available to an authorized owner or administrator.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots Publishes immutable product-change evidence.
   * @evidenceReview docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots Reviewed the snapshot-only read path and owner guard.
   * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Applies snapshot integrity and visibility policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Reviewed the retained snapshot projection and seller ownership boundary.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Exposes retained commercial change evidence.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Reviewed the immutable snapshot reader and authorized boundary.
   * @tag Snapshot */
  @core.TypedRoute.Patch("product/snapshots/:id")
  public async productSnapshots(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingProduct.ISnapshotRequest): Promise<IPage<IShoppingProduct>> { return ShoppingCatalogProvider.productSnapshots(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
  /** Create a seller product.
   * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model Publishes the product model creation boundary.
   * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-product-model Reviewed seller ownership, category, and base-price persistence.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Publishes the product operation family.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-functions-product-operations Reviewed the seller guard and product provider delegation.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Applies product validation and retirement policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Reviewed seller eligibility, live category, and input validation.
   * @tag Product */
  @core.TypedRoute.Post("seller/product/create")
  public async productCreate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedBody() input: IShoppingProduct.ICreate): Promise<IShoppingProduct> { return ShoppingCatalogProvider.productCreate(await ShoppingSellerSessionProvider.seller(headers.Authorization), input); }
  /** Edit an owned seller product.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Applies product ownership and edit validation.
   * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Reviewed the owner and live-category guards.
   * @tag Product */
  @core.TypedRoute.Put("seller/product/update/:id")
  public async productUpdate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingProduct.IUpdate): Promise<IShoppingProduct> { return ShoppingCatalogProvider.productUpdate(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
  /** Delete an owned seller product.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Applies seller-owned deletion restrictions.
   * @evidenceReview docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies Reviewed active fulfillment and request blockers.
   * @tag Product */
  @core.TypedRoute.Delete("seller/product/delete/:id")
  public async productErase(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer.IResult> { return ShoppingCatalogProvider.productErase(await ShoppingSellerSessionProvider.seller(headers.Authorization), id); }
  /** Upload one product image.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-3-order-product-images This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-3-order-product-images Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_product_images This operation exposes the persisted model shopping_product_images.
 * @evidenceReview prisma:shopping_product_images Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("seller/product/image/create/:id")
  public async imageCreate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingProduct.IImageCreate): Promise<IShoppingProduct> { return ShoppingCatalogProvider.imageCreate(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
  /** Reorder product images.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations Publishes the product-image operation family.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations Reviewed owner authorization, sequence validation, and snapshot delegation.
   * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Records the complete aggregate after image mutation.
   * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies Reviewed the image order and snapshot transaction.
   * @tag ProductImage */
  @core.TypedRoute.Put("seller/product/image/reorder/:id")
  public async imageReorder(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingProduct.IImageReorder): Promise<IShoppingProduct> { return ShoppingCatalogProvider.imageReorder(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
  /** Delete one product image.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Applies owned image deletion policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Reviewed the owner guard and sequence compaction.
   * @tag ProductImage */
  @core.TypedRoute.Delete("seller/product/image/delete/:id/:imageId")
  public async imageErase(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedParam("imageId") imageId: string): Promise<IShoppingProduct> { return ShoppingCatalogProvider.imageErase(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, imageId); }
  /** Add a product variant.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Publishes the product-variant model.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model Reviewed product ownership, SKU/options, price, and inventory relation.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-1-make-an-in-stock-variant-available This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-1-make-an-in-stock-variant-available Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-2-expose-the-out-of-stock-state This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-2-expose-the-out-of-stock-state Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-3-retire-a-deletable-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-3-retire-a-deletable-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-4-preserve-retired-variant-evidence This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-4-preserve-retired-variant-evidence Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-2-attach-movements-to-one-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-2-attach-movements-to-one-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-1-relate-a-cart-to-its-customer-and-variants This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-1-relate-a-cart-to-its-customer-and-variants Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-2-keep-one-line-per-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-2-keep-one-line-per-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-3-combine-purchased-quantity-by-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-3-combine-purchased-quantity-by-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-1-restock-a-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-1-restock-a-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-3-view-variant-inventory-history This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-3-view-variant-inventory-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-1-require-a-unique-sku-and-concrete-option-combination This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-1-require-a-unique-sku-and-concrete-option-combination Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-2-validate-the-optional-price-override This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-2-validate-the-optional-price-override Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-3-require-an-available-variant-for-purchase This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-3-require-an-available-variant-for-purchase Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-4-block-variant-deletion-during-fulfillment This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-4-block-variant-deletion-during-fulfillment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-5-block-variant-deletion-during-unresolved-requests This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-5-block-variant-deletion-during-unresolved-requests Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-3-admit-only-a-purchasable-live-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-3-admit-only-a-purchasable-live-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-2-consolidate-purchased-units-by-variant This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-2-consolidate-purchased-units-by-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_product_variants This operation exposes the persisted model shopping_product_variants.
 * @evidenceReview prisma:shopping_product_variants Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("seller/product/variant/create/:id")
  public async variantCreate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingProduct.IVariantCreate): Promise<IShoppingProductVariant> { return ShoppingCatalogProvider.variantCreate(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
  /** Edit a product variant.
   * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations Publishes the variant operation family.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations Reviewed create, edit, and retirement ownership boundaries.
   * @evidence docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies Applies variant identity and availability policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies Reviewed normalized SKU/options, price, and retirement guards.
   * @tag Variant */
  @core.TypedRoute.Put("seller/product/variant/update/:id/:variantId")
  public async variantUpdate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedParam("variantId") variantId: string, @core.TypedBody() input: IShoppingProduct.IVariantUpdate): Promise<IShoppingProductVariant> { return ShoppingCatalogProvider.variantUpdate(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, variantId, input); }
  /** Retire a product variant.
   * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Publishes variant lifecycle retirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Reviewed live-retirement and fulfillment blockers.
   * @tag Variant */
  @core.TypedRoute.Delete("seller/product/variant/delete/:id/:variantId")
  public async variantErase(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedParam("variantId") variantId: string): Promise<IShoppingCustomer.IResult> { return ShoppingCatalogProvider.variantErase(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, variantId); }
  /** Add a positive or negative inventory movement.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-1-define-an-inventory-movement This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-1-define-an-inventory-movement Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-3-derive-current-stock-from-history This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-3-derive-current-stock-from-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-4-distinguish-automatic-commerce-movements This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-4-distinguish-automatic-commerce-movements Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-5-present-complete-inventory-history This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-5-present-complete-inventory-history Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-1-require-attributable-nonzero-inventory-movements This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-1-require-attributable-nonzero-inventory-movements Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-2-apply-seller-movement-signs This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-2-apply-seller-movement-signs Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-3-prevent-negative-or-reserved-stock-depletion This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-3-prevent-negative-or-reserved-stock-depletion Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-4-deduct-purchased-quantity-at-order-creation This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-4-deduct-purchased-quantity-at-order-creation Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-5-restore-returned-item-quantity-exactly-once This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-5-restore-returned-item-quantity-exactly-once Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-3-use-inventory-history-for-stock-changes This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-snapshot-policies-3-use-inventory-history-for-stock-changes Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_inventory_movements This operation exposes the persisted model shopping_inventory_movements.
 * @evidenceReview prisma:shopping_inventory_movements Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("seller/variant/inventory/create/:id")
  public async inventoryCreate(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingProductVariant.IMovement): Promise<IShoppingProductVariant.IMovementSummary> { return ShoppingCatalogProvider.inventoryCreate(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
  /** Page inventory movements newest first.
   * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model Publishes the inventory-history model projection.
   * @evidenceReview docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model Reviewed the complete variant movement history.
   * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations Publishes the inventory operation family.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations Reviewed the seller-owned movement list and pagination.
   * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies Applies inventory movement and stock policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies Reviewed owner scope and ledger-derived stock history.
   * @tag Inventory */
  @core.TypedRoute.Patch("seller/variant/inventory/list/:id")
  public async inventoryIndex(@core.TypedHeaders() headers: IShoppingSeller.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingProductVariant.IRequest): Promise<IPage<IShoppingProductVariant.IMovementSummary>> { return ShoppingCatalogProvider.inventoryIndex(await ShoppingSellerSessionProvider.seller(headers.Authorization), id, input); }
}
