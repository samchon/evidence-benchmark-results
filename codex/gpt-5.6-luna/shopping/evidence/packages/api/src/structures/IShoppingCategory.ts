import type { tags } from "typia";

/**
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model This DTO family represents req-category-domain category model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-1-define-category-information This DTO family represents req-category-domain-1 define category information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-2-limit-the-category-hierarchy This DTO family represents req-category-domain-2 limit the category hierarchy at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-3-classify-a-product This DTO family represents req-category-domain-3 classify a product at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-4-uncategorize-products-after-category-deletion This DTO family represents req-category-domain-4 uncategorize products after category deletion at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations This DTO family represents req-category-functions category operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category This DTO family represents req-category-functions-1 create a category at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category This DTO family represents req-category-functions-2 edit a category at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category This DTO family represents req-category-functions-3 delete a category at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories This DTO family represents req-category-functions-4 browse categories at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category This DTO family represents req-category-functions-5 view products in a category at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies This DTO family represents req-category-policies category hierarchy and curation policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-2-limit-category-depth-to-two-levels This DTO family represents req-category-policies-2 limit category depth to two levels at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-3-assign-products-only-to-live-categories This DTO family represents req-category-policies-3 assign products only to live categories at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-4-uncategorize-products-when-taxonomy-is-retired This DTO family represents req-category-policies-4 uncategorize products when taxonomy is retired at the API boundary. Shared category tree contract. @evidence docs/analysis/02-domain-model.md Represents shopping_categories. *
 * @evidence prisma:shopping_categories This DTO family exposes the shopping_categories aggregate where the public contract needs it.
 */
export interface IShoppingCategory {
  /**
   * Category UUID.
   * @evidence prisma:shopping_categories.id Carries the persisted value represented by this DTO property.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Name.
   * @evidence prisma:shopping_categories.name Carries the persisted value represented by this DTO property.
   */
  name: string;
  /**
   * Description.
   * @evidence prisma:shopping_categories.description Carries the persisted value represented by this DTO property.
   */
  description: string;
  /**
   * Optional parent id.
   * @evidence prisma:shopping_categories.parent_id Carries the persisted value represented by this DTO property.
   */
  parentId: null | (string & tags.Format<"uuid">);
  /**
   * Live or retired state.
   * @evidence prisma:shopping_categories.status Carries the persisted value represented by this DTO property.
   */
  status: string;
  /** Direct subcategories. @evidence docs/analysis/02-domain-model.md */
  children: IShoppingCategory[];
}
export namespace IShoppingCategory {
  /** Category create input. @evidence docs/analysis/03-functional-requirements.md */
  export interface ICreate { name: string & tags.MinLength<1>; description: string; parentId?: null | (string & tags.Format<"uuid">); }
  /** Category update input. @evidence docs/analysis/03-functional-requirements.md */
  export interface IUpdate { name: string & tags.MinLength<1>; description: string; }
}
