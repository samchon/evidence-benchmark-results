import type { tags } from "typia";
import type { IPage } from "../typings";

/**
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model This DTO family represents req-product-domain product model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-1-define-product-catalog-information This DTO family represents req-product-domain-1 define product catalog information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-3-order-product-images This DTO family represents req-product-domain-3 order product images at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-4-relate-variants-to-a-product This DTO family represents req-product-domain-4 relate variants to a product at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-5-relate-products-to-discovery-and-history This DTO family represents req-product-domain-5 relate products to discovery and history at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states This DTO family represents req-product-lifecycle product availability and retirement states at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-1-show-a-newly-created-product This DTO family represents req-product-lifecycle-1 show a newly created product at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-2-mark-a-product-unavailable-without-variants This DTO family represents req-product-lifecycle-2 mark a product unavailable without variants at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-4-remove-live-product-relationships This DTO family represents req-product-lifecycle-4 remove live product relationships at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-5-retain-history-after-product-deletion This DTO family represents req-product-lifecycle-5 retain history after product deletion at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-product-variant-model This DTO family represents req-product-variant-domain product variant model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-1-define-variant-information This DTO family represents req-product-variant-domain-1 define variant information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-2-relate-a-variant-to-its-product This DTO family represents req-product-variant-domain-2 relate a variant to its product at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-3-resolve-the-effective-variant-price This DTO family represents req-product-variant-domain-3 resolve the effective variant price at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-4-calculate-variant-stock This DTO family represents req-product-variant-domain-4 calculate variant stock at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-product-variant-domain-5-use-variants-as-commerce-units This DTO family represents req-product-variant-domain-5 use variants as commerce units at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement This DTO family represents req-variant-lifecycle variant availability and retirement at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-1-make-an-in-stock-variant-available This DTO family represents req-variant-lifecycle-1 make an in-stock variant available at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-2-expose-the-out-of-stock-state This DTO family represents req-variant-lifecycle-2 expose the out-of-stock state at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-3-retire-a-deletable-variant This DTO family represents req-variant-lifecycle-3 retire a deletable variant at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-4-preserve-retired-variant-evidence This DTO family represents req-variant-lifecycle-4 preserve retired-variant evidence at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-inventory-history-model This DTO family represents req-inventory-domain inventory history model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-1-define-an-inventory-movement This DTO family represents req-inventory-domain-1 define an inventory movement at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-2-attach-movements-to-one-variant This DTO family represents req-inventory-domain-2 attach movements to one variant at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-3-derive-current-stock-from-history This DTO family represents req-inventory-domain-3 derive current stock from history at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-4-distinguish-automatic-commerce-movements This DTO family represents req-inventory-domain-4 distinguish automatic commerce movements at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-inventory-domain-5-present-complete-inventory-history This DTO family represents req-inventory-domain-5 present complete inventory history at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots This DTO family represents req-snapshot-domain immutable change snapshots at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-1-define-change-snapshots This DTO family represents req-snapshot-domain-1 define change snapshots at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-2-keep-snapshots-immutable This DTO family represents req-snapshot-domain-2 keep snapshots immutable at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-3-capture-complete-product-state This DTO family represents req-snapshot-domain-3 capture complete product state at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-4-capture-other-mutable-evidence This DTO family represents req-snapshot-domain-4 capture other mutable evidence at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-5-capture-purchase-time-item-state This DTO family represents req-snapshot-domain-5 capture purchase-time item state at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-6-retain-evidence-after-live-deletion This DTO family represents req-snapshot-domain-6 retain evidence after live deletion at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-7-limit-snapshot-visibility This DTO family represents req-snapshot-domain-7 limit snapshot visibility at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-3-combine-purchased-quantity-by-variant This DTO family represents req-order-domain-3 combine purchased quantity by variant at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations This DTO family represents req-product-functions product operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-1-create-a-product This DTO family represents req-product-functions-1 create a product at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-2-edit-a-product This DTO family represents req-product-functions-2 edit a product at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-3-delete-an-owned-product This DTO family represents req-product-functions-3 delete an owned product at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots This DTO family represents req-product-functions-4 view own product snapshots at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products This DTO family represents req-product-functions-5 list and view all products at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-6-view-any-product-snapshots This DTO family represents req-product-functions-6 view any product snapshots at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product This DTO family represents req-product-functions-7 delete a policy-violating product at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations This DTO family represents req-product-image-functions product image operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images This DTO family represents req-product-image-functions-1 upload product images at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images This DTO family represents req-product-image-functions-2 reorder product images at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image This DTO family represents req-product-image-functions-3 delete a product image at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-product-variant-operations This DTO family represents req-variant-functions product variant operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-1-add-a-product-variant This DTO family represents req-variant-functions-1 add a product variant at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-2-edit-a-product-variant This DTO family represents req-variant-functions-2 edit a product variant at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-variant-functions-3-delete-a-product-variant This DTO family represents req-variant-functions-3 delete a product variant at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-inventory-operations This DTO family represents req-inventory-functions inventory operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-1-restock-a-variant This DTO family represents req-inventory-functions-1 restock a variant at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-2-subtract-inventory This DTO family represents req-inventory-functions-2 subtract inventory at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-inventory-functions-3-view-variant-inventory-history This DTO family represents req-inventory-functions-3 view variant inventory history at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey This DTO family represents req-product-discovery product discovery journey at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-1-search-the-product-catalog This DTO family represents req-product-discovery-1 search the product catalog at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-2-compare-product-cards This DTO family represents req-product-discovery-2 compare product cards at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-3-view-product-details This DTO family represents req-product-discovery-3 view product details at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies This DTO family represents req-product-policies product validation and retirement policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-1-require-valid-product-catalog-data This DTO family represents req-product-policies-1 require valid product catalog data at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-2-enforce-product-ownership This DTO family represents req-product-policies-2 enforce product ownership at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-3-snapshot-the-complete-aggregate-on-catalog-edit This DTO family represents req-product-policies-3 snapshot the complete aggregate on catalog edit at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-6-retire-violating-merchandise-without-stranding-obligations This DTO family represents req-product-policies-6 retire violating merchandise without stranding obligations at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-variant-identity-price-availability-and-retirement-policies This DTO family represents req-variant-policies variant identity, price, availability, and retirement policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-1-require-a-unique-sku-and-concrete-option-combination This DTO family represents req-variant-policies-1 require a unique sku and concrete option combination at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-2-validate-the-optional-price-override This DTO family represents req-variant-policies-2 validate the optional price override at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-3-require-an-available-variant-for-purchase This DTO family represents req-variant-policies-3 require an available variant for purchase at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-4-block-variant-deletion-during-fulfillment This DTO family represents req-variant-policies-4 block variant deletion during fulfillment at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-variant-policies-5-block-variant-deletion-during-unresolved-requests This DTO family represents req-variant-policies-5 block variant deletion during unresolved requests at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-inventory-movement-and-stock-policies This DTO family represents req-inventory-policies inventory movement and stock policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-1-require-attributable-nonzero-inventory-movements This DTO family represents req-inventory-policies-1 require attributable nonzero inventory movements at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-3-prevent-negative-or-reserved-stock-depletion This DTO family represents req-inventory-policies-3 prevent negative or reserved-stock depletion at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-4-deduct-purchased-quantity-at-order-creation This DTO family represents req-inventory-policies-4 deduct purchased quantity at order creation at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-inventory-policies-5-restore-returned-item-quantity-exactly-once This DTO family represents req-inventory-policies-5 restore returned item quantity exactly once at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies This DTO family represents req-snapshot-policies snapshot integrity and visibility policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-1-create-evidence-for-covered-commercial-changes This DTO family represents req-snapshot-policies-1 create evidence for covered commercial changes at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-2-capture-the-complete-product-aggregate This DTO family represents req-snapshot-policies-2 capture the complete product aggregate at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-3-use-inventory-history-for-stock-changes This DTO family represents req-snapshot-policies-3 use inventory history for stock changes at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-4-keep-snapshots-immutable-and-undeletable This DTO family represents req-snapshot-policies-4 keep snapshots immutable and undeletable at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-5-limit-snapshot-evidence-to-relevant-parties This DTO family represents req-snapshot-policies-5 limit snapshot evidence to relevant parties at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies This DTO family represents req-search-policies product search and listing policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-2-combine-product-search-constraints This DTO family represents req-search-policies-2 combine product search constraints at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-3-order-and-page-search-results-deterministically This DTO family represents req-search-policies-3 order and page search results deterministically at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-4-render-the-standard-product-card This DTO family represents req-search-policies-4 render the standard product card at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-2-consolidate-purchased-units-by-variant This DTO family represents req-order-policies-2 consolidate purchased units by variant at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-3-preserve-a-complete-product-time-point This DTO family represents req-nfr-audit-integrity-3 preserve a complete product time point at the API boundary. Seller product aggregate and commerce variants. @evidence docs/analysis/02-domain-model.md Represents shopping_products and children. *
 * @evidence prisma:shopping_products This DTO family exposes the shopping_products aggregate where the public contract needs it.
 * @evidence prisma:shopping_product_images This DTO family exposes the shopping_product_images aggregate where the public contract needs it.
 * @evidence prisma:shopping_product_variants This DTO family exposes the shopping_product_variants aggregate where the public contract needs it.
 * @evidence prisma:shopping_inventory_movements This DTO family exposes the shopping_inventory_movements aggregate where the public contract needs it.
 * @evidence prisma:shopping_product_snapshots This DTO family exposes the shopping_product_snapshots aggregate where the public contract needs it.
 */
export interface IShoppingProduct {
  /**
   * Product UUID.
   * @evidence prisma:shopping_products.id Carries the persisted value represented by this DTO property.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Owning seller id.
   * @evidence prisma:shopping_products.shopping_seller_id Carries the persisted value represented by this DTO property.
   */
  sellerId: string & tags.Format<"uuid">;
  /**
   * Product name.
   * @evidence prisma:shopping_products.name Carries the persisted value represented by this DTO property.
   */
  name: string;
  /**
   * Product description.
   * @evidence prisma:shopping_products.description Carries the persisted value represented by this DTO property.
   */
  description: string;
  /**
   * Base price.
   * @evidence prisma:shopping_products.base_price Carries the persisted value represented by this DTO property.
   */
  basePrice: number;
  /**
   * Product state.
   * @evidence prisma:shopping_products.status Carries the persisted value represented by this DTO property.
   */
  status: string;
  /**
   * Optional category id.
   * @evidence prisma:shopping_products.shopping_category_id Carries the persisted value represented by this DTO property.
   */
  categoryId: null | (string & tags.Format<"uuid">);
  /**
   * Ordered images.
   * @evidence prisma:shopping_product_images.id Image projections carry identity.
   * @evidence prisma:shopping_product_images.url Image projections carry the URL.
   * @evidence prisma:shopping_product_images.sort_order Image projections carry display order.
   */
  images: IShoppingProduct.IImage[];
  /**
   * Variants.
   * @evidence prisma:shopping_product_variants.id Variant projections carry identity.
   * @evidence prisma:shopping_product_variants.sku Variant projections carry SKU.
   * @evidence prisma:shopping_product_variants.options_json Variant projections carry options.
   * @evidence prisma:shopping_product_variants.price_override Variant projections carry effective price.
   * @evidence prisma:shopping_product_variants.status Variant projections carry lifecycle state.
   * @evidence prisma:shopping_inventory_movements.quantity Variant projections expose current stock derived from movements.
   */
  variants: IShoppingProduct.IVariant[];
  /**
   * Creation instant.
   * @evidence prisma:shopping_products.created_at Carries the persisted value represented by this DTO property.
   * @evidence prisma:shopping_product_snapshots.id Snapshot projections carry historical identity.
   * @evidence prisma:shopping_product_snapshots.name Snapshot projections carry historical names.
   * @evidence prisma:shopping_product_snapshots.description Snapshot projections carry historical descriptions.
   * @evidence prisma:shopping_product_snapshots.base_price Snapshot projections carry historical prices.
   * @evidence prisma:shopping_product_snapshots.changed_fields Snapshot projections carry changed-field summaries.
   * @evidence prisma:shopping_product_snapshots.created_at Snapshot projections carry historical timestamps.
   */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IShoppingProduct {
  /** Product card. @evidence docs/analysis/04-business-rules.md */
  export type ISummary = Pick<IShoppingProduct, "id" | "name" | "basePrice" | "status" | "categoryId" | "createdAt">;
  /** Product create input. @evidence docs/analysis/03-functional-requirements.md */
  export interface ICreate { name: string & tags.MinLength<1>; description: string & tags.MinLength<1>; basePrice: number & tags.Minimum<0>; categoryId?: null | (string & tags.Format<"uuid">); }
  /** Product update input. @evidence docs/analysis/03-functional-requirements.md */
  export type IUpdate = ICreate;
  /** Product list request. @evidence docs/analysis/04-business-rules.md */
  export interface IRequest extends IPage.IRequest { search?: null | string; categoryId?: null | (string & tags.Format<"uuid">); }
  /**
   * Ordered image.
   */
  export interface IImage {
    /**
     * Image id.
     * @evidence prisma:shopping_product_images.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Image URL.
     * @evidence prisma:shopping_product_images.url Carries the persisted value represented by this DTO property.
     */
    url: string;
    /**
     * Display order.
     * @evidence prisma:shopping_product_images.sort_order Carries the persisted value represented by this DTO property.
     */
    sortOrder: number;
  }
  /** Product image input. @evidence docs/analysis/03-functional-requirements.md */
  export interface IImageCreate { url: string & tags.Format<"uri">; }
  /** Product image ordering input. @evidence docs/analysis/03-functional-requirements.md */
  export interface IImageReorder { imageIds: Array<string & tags.Format<"uuid">>; }
  /**
   * Product variant.
   */
  export interface IVariant {
    /**
     * Variant id.
     * @evidence prisma:shopping_product_variants.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * SKU.
     * @evidence prisma:shopping_product_variants.sku Carries the persisted value represented by this DTO property.
     */
    sku: string;
    /**
     * Variant options.
     * @evidence prisma:shopping_product_variants.options_json Carries the persisted value represented by this DTO property.
     */
    options: Record<string, string>;
    /**
     * Effective price.
     * @evidence prisma:shopping_product_variants.price_override Carries the persisted value represented by this DTO property.
     */
    price: number;
    /**
     * Available stock.
     * @evidence prisma:shopping_inventory_movements.quantity Carries the persisted value represented by this DTO property.
     */
    stock: number;
    /**
     * Variant state.
     * @evidence prisma:shopping_product_variants.status Carries the persisted value represented by this DTO property.
     */
    status: string;
  }
  /** Variant creation input. @evidence docs/analysis/03-functional-requirements.md */
  export interface IVariantCreate { sku: string & tags.MinLength<1>; options: Record<string, string>; priceOverride?: null | (number & tags.Minimum<0>); }
  /** Variant update input. @evidence docs/analysis/03-functional-requirements.md */
  export type IVariantUpdate = IVariantCreate;
  /** Inventory movement input. @evidence docs/analysis/03-functional-requirements.md */
  export interface IInventoryCreate { quantity: number & tags.Type<"int32">; reason: string & tags.MinLength<1>; }
  /**
   * Inventory movement.
   */
  export interface IInventory {
    /**
     * Movement id.
     * @evidence prisma:shopping_inventory_movements.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Signed quantity.
     * @evidence prisma:shopping_inventory_movements.quantity Carries the persisted value represented by this DTO property.
     */
    quantity: number;
    /**
     * Movement reason.
     * @evidence prisma:shopping_inventory_movements.reason Carries the persisted value represented by this DTO property.
     */
    reason: string;
    /**
     * Movement time.
     * @evidence prisma:shopping_inventory_movements.created_at Carries the persisted value represented by this DTO property.
     */
    createdAt: string & tags.Format<"date-time">;
  }
  /**
   * Immutable product snapshot.
   */
  export interface ISnapshot {
    /**
     * Snapshot id.
     * @evidence prisma:shopping_product_snapshots.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Historical name.
     * @evidence prisma:shopping_product_snapshots.name Carries the persisted value represented by this DTO property.
     */
    name: string;
    /**
     * Historical description.
     * @evidence prisma:shopping_product_snapshots.description Carries the persisted value represented by this DTO property.
     */
    description: string;
    /**
     * Historical price.
     * @evidence prisma:shopping_product_snapshots.base_price Carries the persisted value represented by this DTO property.
     */
    basePrice: number;
    /**
     * Changed-field summary.
     * @evidence prisma:shopping_product_snapshots.changed_fields Carries the persisted value represented by this DTO property.
     */
    changedFields: string;
    /**
     * Snapshot time.
     * @evidence prisma:shopping_product_snapshots.created_at Carries the persisted value represented by this DTO property.
     */
    createdAt: string & tags.Format<"date-time">;
  }
}
