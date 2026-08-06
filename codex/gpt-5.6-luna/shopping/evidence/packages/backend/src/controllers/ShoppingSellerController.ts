import { TypedBody, TypedHeaders, TypedParam, TypedRoute as Route } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";
import type { tags } from "typia";

import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Seller profile, catalog, variant, and inventory operations. */
@Controller("shopping/seller")
export class ShoppingSellerController {
  /**
   * View the acting seller's profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-3-recover-from-seller-rejection This controller operation realizes the seller account lifecycle 3 recover from seller rejection contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-2-relate-a-profile-to-its-seller This controller operation realizes the seller profile domain 2 relate a profile to its seller contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller This controller operation realizes the seller account lifecycle 2 operate as an approved seller contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-6-preserve-records-for-a-banned-seller This controller operation realizes the seller account lifecycle 6 preserve records for a banned seller contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-5-block-seller-deletion-during-unresolved-requests This controller operation realizes the seller account policies 5 block seller deletion during unresolved requests contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states This controller operation realizes the seller account lifecycle seller account states contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-seller-profile-model This controller operation realizes the seller profile domain seller profile model contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-5-restore-an-unsuspended-seller This controller operation realizes the seller account lifecycle 5 restore an unsuspended seller contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-4-block-seller-deletion-during-active-fulfillment This controller operation realizes the seller account policies 4 block seller deletion during active fulfillment contract through profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-seller-profile-operations This controller operation realizes the seller profile functions seller profile operations contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-3-separate-suspension-from-fulfillment-duties This controller operation realizes the seller account policies 3 separate suspension from fulfillment duties contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-3-preserve-seller-profile-revisions This controller operation realizes the seller profile domain 3 preserve seller profile revisions contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-4-preserve-the-purchase-time-shop-identity This controller operation realizes the seller profile domain 4 preserve the purchase time shop identity contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-4-restrict-a-suspended-seller This controller operation realizes the seller account lifecycle 4 restrict a suspended seller contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-profile-domain-1-define-seller-profile-information This controller operation realizes the seller profile domain 1 define seller profile information contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-2-require-and-retain-a-seller-rejection-reason This controller operation realizes the seller account policies 2 require and retain a seller rejection reason contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-7-retire-a-deleted-seller This controller operation realizes the seller account lifecycle 7 retire a deleted seller contract through profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-1-view-the-own-seller-profile Reads the live shop presentation.
   * @evidence prisma:shopping_seller_profiles Exposes persisted profile values.
   */
  @Route.Get("profile/view")
  public async profile(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingSeller.IProfile> { return ShoppingProvider.sellerProfile(AuthUtil.parse(headers.authorization).id); }
  /**
   * Edit the acting seller's profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-2-edit-the-seller-profile Updates the live profile and records a revision.
   * @evidence prisma:shopping_seller_profile_snapshots Preserves before-and-after evidence.
   */
  @Route.Put("profile/update")
  public async updateProfile(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingSeller.IProfileUpdate): Promise<api.IShoppingSeller.IProfile> { return ShoppingProvider.updateSellerProfile(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * View seller approval status.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-1-require-approval-before-selling This controller operation realizes the seller account policies 1 require approval before selling contract through approval.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations This controller operation realizes the seller account functions seller approval and restriction operations contract through approval.
   * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-1-begin-seller-approval-as-pending This controller operation realizes the seller account lifecycle 1 begin seller approval as pending contract through approval.
   * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies This controller operation realizes the seller account policies seller approval restriction and deletion policies contract through approval.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-1-view-seller-approval-status Returns approval and rejection reason.
   * @evidence prisma:shopping_sellers Reads lifecycle state.
   */
  @Route.Get("approval/status")
  public async approval(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingSeller.IApproval> { return ShoppingProvider.sellerApproval(AuthUtil.parse(headers.authorization).id); }
  /**
   * Resubmit a rejected seller application.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-2-resubmit-seller-approval Creates a fresh pending request.
   * @evidence prisma:shopping_seller_approval_requests Retains prior decisions.
   */
  @Route.Post("approval/resubmit")
  public async resubmit(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingSeller.IApproval> { return ShoppingProvider.sellerResubmit(AuthUtil.parse(headers.authorization).id); }
  /**
   * Create a product owned by the acting approved seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-1-create-a-product Persists valid catalog data.
   * @evidence prisma:shopping_products Creates the product aggregate.
   */
  @Route.Post("product/create")
  public async createProduct(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingProduct.ICreate): Promise<api.IShoppingProduct> { return ShoppingProvider.createProduct(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * Edit an owned product.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-2-edit-a-product Updates catalog values and snapshots the aggregate.
   * @evidence prisma:shopping_product_snapshots Preserves immutable evidence.
   */
  @Route.Put("product/:id/update")
  public async updateProduct(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingProduct.IUpdate): Promise<api.IShoppingProduct> { return ShoppingProvider.updateProduct(AuthUtil.parse(headers.authorization).id, id, body); }
  /**
   * Delete an owned product after fulfillment blockers clear.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-3-delete-an-owned-product Removes live catalog membership while retaining evidence.
   * @evidence prisma:shopping_products Changes lifecycle state.
   */
  @Route.Delete("product/:id/delete")
  public async deleteProduct(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.deleteProduct(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Add a product variant.
   * @evidence docs/analysis/04-business-rules.md#req-variant-policies-4-block-variant-deletion-during-fulfillment This controller operation realizes the variant policies 4 block variant deletion during fulfillment contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-3-resolve-the-effective-variant-price This controller operation realizes the product variant domain 3 resolve the effective variant price contract through createVariant.
   * @evidence docs/analysis/04-business-rules.md#req-order-policies-2-consolidate-purchased-units-by-variant This controller operation realizes the order policies 2 consolidate purchased units by variant contract through createVariant.
   * @evidence docs/analysis/04-business-rules.md#req-variant-policies-2-validate-the-optional-price-override This controller operation realizes the variant policies 2 validate the optional price override contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-order-domain-3-combine-purchased-quantity-by-variant This controller operation realizes the order domain 3 combine purchased quantity by variant contract through createVariant.
   * @evidence docs/analysis/04-business-rules.md#req-variant-policies-5-block-variant-deletion-during-unresolved-requests This controller operation realizes the variant policies 5 block variant deletion during unresolved requests contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-1-define-variant-information This controller operation realizes the product variant domain 1 define variant information contract through createVariant.
   * @evidence docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies This controller operation realizes the variant policies variant identity price availability and retirement policies contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-2-mark-a-product-unavailable-without-variants This controller operation realizes the product lifecycle 2 mark a product unavailable without variants contract through createVariant.
   * @evidence docs/analysis/04-business-rules.md#req-variant-policies-3-require-an-available-variant-for-purchase This controller operation realizes the variant policies 3 require an available variant for purchase contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-product-domain-4-relate-variants-to-a-product This controller operation realizes the product domain 4 relate variants to a product contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement This controller operation realizes the variant lifecycle variant availability and retirement contract through createVariant.
   * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations This controller operation realizes the variant functions product variant operations contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-5-use-variants-as-commerce-units This controller operation realizes the product variant domain 5 use variants as commerce units contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-2-relate-a-variant-to-its-product This controller operation realizes the product variant domain 2 relate a variant to its product contract through createVariant.
   * @evidence docs/analysis/04-business-rules.md#req-variant-policies-1-require-a-unique-sku-and-concrete-option-combination This controller operation realizes the variant policies 1 require a unique sku and concrete option combination contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model This controller operation realizes the product variant domain product variant model contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-3-retire-a-deletable-variant This controller operation realizes the variant lifecycle 3 retire a deletable variant contract through createVariant.
   * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-4-preserve-retired-variant-evidence This controller operation realizes the variant lifecycle 4 preserve retired variant evidence contract through createVariant.
   * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-1-add-a-product-variant Creates a unique SKU with zero initial stock.
   * @evidence prisma:shopping_product_variants Persists the commerce unit.
   */
  @Route.Post("product/:productId/variant")
  public async createVariant(@TypedHeaders() headers: { authorization?: string }, @TypedParam("productId") productId: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingProduct.IVariantCreate): Promise<api.IShoppingProduct.IVariant> { return ShoppingProvider.createVariant(AuthUtil.parse(headers.authorization).id, productId, body); }
  /**
   * Edit an owned variant.
   * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-2-edit-a-product-variant Updates SKU options and price.
   * @evidence prisma:shopping_product_variants Persists mutable variant values.
   */
  @Route.Put("variant/:id/update")
  public async updateVariant(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingProduct.IVariantUpdate): Promise<api.IShoppingProduct.IVariant> { return ShoppingProvider.updateVariant(AuthUtil.parse(headers.authorization).id, id, body); }
  /**
   * Retire an owned variant.
   * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-3-delete-a-product-variant Refuses active fulfillment and retires the SKU.
   * @evidence prisma:shopping_product_variants Changes lifecycle state.
   */
  @Route.Delete("variant/:id/delete")
  public async deleteVariant(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.deleteVariant(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Append a signed inventory movement.
   * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-2-apply-seller-movement-signs This controller operation realizes the inventory policies 2 apply seller movement signs contract through inventory.
   * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations This controller operation realizes the inventory functions inventory operations contract through inventory.
   * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-2-expose-the-out-of-stock-state This controller operation realizes the variant lifecycle 2 expose the out of stock state contract through inventory.
   * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-4-calculate-variant-stock This controller operation realizes the product variant domain 4 calculate variant stock contract through inventory.
   * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-1-define-an-inventory-movement This controller operation realizes the inventory domain 1 define an inventory movement contract through inventory.
   * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-1-require-attributable-nonzero-inventory-movements This controller operation realizes the inventory policies 1 require attributable nonzero inventory movements contract through inventory.
   * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-1-make-an-in-stock-variant-available This controller operation realizes the variant lifecycle 1 make an in stock variant available contract through inventory.
   * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies This controller operation realizes the inventory policies inventory movement and stock policies contract through inventory.
   * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-4-distinguish-automatic-commerce-movements This controller operation realizes the inventory domain 4 distinguish automatic commerce movements contract through inventory.
   * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory This controller operation realizes the inventory functions 2 subtract inventory contract through inventory.
   * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-4-deduct-purchased-quantity-at-order-creation This controller operation realizes the inventory policies 4 deduct purchased quantity at order creation contract through inventory.
   * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-2-attach-movements-to-one-variant This controller operation realizes the inventory domain 2 attach movements to one variant contract through inventory.
   * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-5-restore-returned-item-quantity-exactly-once This controller operation realizes the inventory policies 5 restore returned item quantity exactly once contract through inventory.
   * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-3-prevent-negative-or-reserved-stock-depletion This controller operation realizes the inventory policies 3 prevent negative or reserved stock depletion contract through inventory.
   * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-1-restock-a-variant Derives stock from immutable movements.
   * @evidence prisma:shopping_inventory_movements Appends the movement.
   */
  @Route.Post("variant/:variantId/inventory/add")
  public async inventory(@TypedHeaders() headers: { authorization?: string }, @TypedParam("variantId") variantId: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingProduct.IInventoryCreate): Promise<api.IShoppingProduct.IVariant> { return ShoppingProvider.inventory(AuthUtil.parse(headers.authorization).id, variantId, body); }
  /**
   * Read complete inventory history.
   * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-3-use-inventory-history-for-stock-changes This controller operation realizes the snapshot policies 3 use inventory history for stock changes contract through inventoryHistory.
   * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-5-present-complete-inventory-history This controller operation realizes the inventory domain 5 present complete inventory history contract through inventoryHistory.
   * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-3-derive-current-stock-from-history This controller operation realizes the inventory domain 3 derive current stock from history contract through inventoryHistory.
   * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model This controller operation realizes the inventory domain inventory history model contract through inventoryHistory.
   * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-3-view-variant-inventory-history Returns all attributable movements.
   * @evidence prisma:shopping_inventory_movements Reads immutable history.
   */
  @Route.Get("variant/:variantId/inventory/history")
  public async inventoryHistory(@TypedHeaders() headers: { authorization?: string }, @TypedParam("variantId") variantId: string & tags.Format<"uuid">): Promise<api.IShoppingProduct.IInventory[]> { return ShoppingProvider.inventoryHistory(AuthUtil.parse(headers.authorization).id, variantId); }
}
