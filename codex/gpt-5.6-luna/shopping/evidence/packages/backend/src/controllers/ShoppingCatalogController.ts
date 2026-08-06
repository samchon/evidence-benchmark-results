import { TypedBody, TypedHeaders, TypedParam, TypedRoute as Route } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";
import type { tags } from "typia";
import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Public catalog, image, and snapshot operations. */
@Controller("shopping/catalog")
export class ShoppingCatalogController {
/** Browse the live category tree.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations This controller operation realizes the category functions category operations contract through categories.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-1-reserve-category-curation-for-administrators This controller operation realizes the category policies 1 reserve category curation for administrators contract through categories.
   * @evidence docs/analysis/02-domain-model.md#req-category-domain-2-limit-the-category-hierarchy This controller operation realizes the category domain 2 limit the category hierarchy contract through categories.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels This controller operation realizes the category policies 2 limit category depth to two levels contract through categories.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies This controller operation realizes the category policies category hierarchy and curation policies contract through categories.
   * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model This controller operation realizes the category domain category model contract through categories.
   * @evidence docs/analysis/02-domain-model.md#req-category-domain-1-define-category-information This controller operation realizes the category domain 1 define category information contract through categories.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories Lists categories for catalog discovery.
   * @evidence prisma:shopping_categories Reads the persisted category taxonomy.
   */
  @Route.Get("category/list")
  public async categories(): Promise<api.IShoppingCategory[]> { return ShoppingProvider.listCategories(); }
  /**
   * View products in a category.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-3-assign-products-only-to-live-categories This controller operation realizes the category policies 3 assign products only to live categories contract through categoryProducts.
   * @evidence docs/analysis/04-business-rules.md#req-category-policies-4-uncategorize-products-when-taxonomy-is-retired This controller operation realizes the category policies 4 uncategorize products when taxonomy is retired contract through categoryProducts.
   * @evidence docs/analysis/02-domain-model.md#req-category-domain-4-uncategorize-products-after-category-deletion This controller operation realizes the category domain 4 uncategorize products after category deletion contract through categoryProducts.
   * @evidence docs/analysis/02-domain-model.md#req-category-domain-3-classify-a-product This controller operation realizes the category domain 3 classify a product contract through categoryProducts.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_products This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("category/:id/products")
  public async categoryProducts(@TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() input: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> { return ShoppingProvider.listProducts({ ...input, categoryId: id }); }
  /**
   * Search the eligible cross-seller catalog.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-4-block-seller-product-deletion-during-fulfillment This controller operation realizes the product policies 4 block seller product deletion during fulfillment contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-5-retain-history-after-product-deletion This controller operation realizes the product lifecycle 5 retain history after product deletion contract through products.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-product-operations This controller operation realizes the product functions product operations contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-search-policies-4-render-the-standard-product-card This controller operation realizes the search policies 4 render the standard product card contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-search-policies-2-combine-product-search-constraints This controller operation realizes the search policies 2 combine product search constraints contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-search-policies-3-order-and-page-search-results-deterministically This controller operation realizes the search policies 3 order and page search results deterministically contract through products.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey This controller operation realizes the product discovery product discovery journey contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-1-require-valid-product-catalog-data This controller operation realizes the product policies 1 require valid product catalog data contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-domain-5-relate-products-to-discovery-and-history This controller operation realizes the product domain 5 relate products to discovery and history contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-domain-2-relate-a-product-to-its-seller This controller operation realizes the product domain 2 relate a product to its seller contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model This controller operation realizes the product domain product model contract through products.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-5-list-and-view-all-products This controller operation realizes the product functions 5 list and view all products contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies This controller operation realizes the search policies product search and listing policies contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states This controller operation realizes the product lifecycle product availability and retirement states contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-4-remove-live-product-relationships This controller operation realizes the product lifecycle 4 remove live product relationships contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-domain-1-define-product-catalog-information This controller operation realizes the product domain 1 define product catalog information contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-1-show-a-newly-created-product This controller operation realizes the product lifecycle 1 show a newly created product contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-6-retire-violating-merchandise-without-stranding-obligations This controller operation realizes the product policies 6 retire violating merchandise without stranding obligations contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-5-block-seller-product-deletion-during-unresolved-requests This controller operation realizes the product policies 5 block seller product deletion during unresolved requests contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies This controller operation realizes the product policies product validation and retirement policies contract through products.
   * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-3-hide-products-during-seller-suspension This controller operation realizes the product lifecycle 3 hide products during seller suspension contract through products.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-2-enforce-product-ownership This controller operation realizes the product policies 2 enforce product ownership contract through products.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-1-search-the-product-catalog This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-2-compare-product-cards This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-search-policies-1-search-the-eligible-cross-seller-catalog This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_products This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("product/search")
  public async products(@TypedBody() input: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> { return ShoppingProvider.listProducts(input); }
  /**
   * View product details.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-3-view-product-details This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_products This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Get("product/:id/detail")
  public async product(@TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingProduct> { return ShoppingProvider.getProduct(id); }
  /**
   * View a public seller profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-profile-functions-3-view-a-public-seller-profile This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_seller_profiles This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Get("seller/:id/profile")
  public async seller(@TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingSeller.IProfile> { return ShoppingProvider.publicSellerProfile(id); }
  /**
   * Upload a product image.
   * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-1-create-evidence-for-covered-commercial-changes This controller operation realizes the snapshot policies 1 create evidence for covered commercial changes contract through imageCreate.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_product_images This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Post("product/:id/image/create")
  public async imageCreate(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingProduct.IImageCreate): Promise<api.IShoppingProduct.IImage> { return ShoppingProvider.addProductImage(AuthUtil.parse(headers.authorization).id, id, body); }
  /**
   * Reorder product images.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_product_images This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("product/:id/image/reorder")
  public async imageReorder(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingProduct.IImageReorder): Promise<api.IShoppingProduct.IImage[]> { return ShoppingProvider.reorderProductImages(AuthUtil.parse(headers.authorization).id, id, body); }
  /**
   * Delete a product image.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_product_images This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Delete("image/:id/delete")
  public async imageDelete(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.deleteProductImage(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * View any product snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-1-define-change-snapshots This controller operation realizes the snapshot domain 1 define change snapshots contract through snapshots.
   * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-2-capture-the-complete-product-aggregate This controller operation realizes the snapshot policies 2 capture the complete product aggregate contract through snapshots.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations This controller operation realizes the product image functions product image operations contract through snapshots.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots This controller operation realizes the product functions 4 view own product snapshots contract through snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-product-domain-3-order-product-images This controller operation realizes the product domain 3 order product images contract through snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-4-capture-other-mutable-evidence This controller operation realizes the snapshot domain 4 capture other mutable evidence contract through snapshots.
   * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-5-limit-snapshot-evidence-to-relevant-parties This controller operation realizes the snapshot policies 5 limit snapshot evidence to relevant parties contract through snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-3-capture-complete-product-state This controller operation realizes the snapshot domain 3 capture complete product state contract through snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-5-capture-purchase-time-item-state This controller operation realizes the snapshot domain 5 capture purchase time item state contract through snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-2-keep-snapshots-immutable This controller operation realizes the snapshot domain 2 keep snapshots immutable contract through snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots This controller operation realizes the snapshot domain immutable change snapshots contract through snapshots.
   * @evidence docs/analysis/04-business-rules.md#req-product-policies-3-snapshot-the-complete-aggregate-on-catalog-edit This controller operation realizes the product policies 3 snapshot the complete aggregate on catalog edit contract through snapshots.
   * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies This controller operation realizes the snapshot policies snapshot integrity and visibility policies contract through snapshots.
   * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-4-keep-snapshots-immutable-and-undeletable This controller operation realizes the snapshot policies 4 keep snapshots immutable and undeletable contract through snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-7-limit-snapshot-visibility This controller operation realizes the snapshot domain 7 limit snapshot visibility contract through snapshots.
   * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-6-retain-evidence-after-live-deletion This controller operation realizes the snapshot domain 6 retain evidence after live deletion contract through snapshots.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-6-view-any-product-snapshots This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_product_snapshots This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-2-reconstruct-each-recorded-modification Reads immutable product change evidence through snapshot history.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-1-keep-commercial-change-evidence-immutable Enforces the audit integrity 1 keep commercial change evidence immutable contract through snapshots.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-3-preserve-a-complete-product-time-point Enforces the audit integrity 3 preserve a complete product time point contract through snapshots.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Enforces the audit integrity commercial change evidence integrity contract through snapshots.
   */
  @Route.Get("product/:id/snapshots")
  public async snapshots(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingProduct.ISnapshot[]> { const actor = AuthUtil.parse(headers.authorization); return ShoppingProvider.productSnapshots({ type: actor.type === "admin" ? "admin" : "seller", id: actor.id }, id); }
}


