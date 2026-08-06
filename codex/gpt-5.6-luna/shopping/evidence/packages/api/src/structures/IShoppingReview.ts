import type { tags } from "typia";

/**
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model This DTO family represents req-review-domain review model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information This DTO family represents req-review-domain-1 define review information at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase This DTO family represents req-review-domain-2 relate a review to its purchase at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase This DTO family represents req-review-domain-3 limit reviews per purchase at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings This DTO family represents req-review-domain-4 retire a review from ratings at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement This DTO family represents req-review-lifecycle review publication and retirement at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review This DTO family represents req-review-lifecycle-1 publish an eligible review at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review This DTO family represents req-review-lifecycle-2 edit a published review at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review This DTO family represents req-review-lifecycle-3 delete a published review at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure This DTO family represents req-review-lifecycle-4 anonymize reviews on account closure at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-2-review-the-order-summary This DTO family represents req-checkout-journey-2 review the order summary at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-review-operations This DTO family represents req-review-functions review operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review This DTO family represents req-review-functions-1 publish a product review at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review This DTO family represents req-review-functions-2 edit an authored review at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review This DTO family represents req-review-functions-3 delete an authored review at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies This DTO family represents req-review-policies review eligibility, ordering, and rating policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase This DTO family represents req-review-policies-1 require a verified delivered purchase at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text This DTO family represents req-review-policies-2 validate review rating and optional text at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order This DTO family represents req-review-policies-3 keep one review identity per product and order at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author This DTO family represents req-review-policies-4 keep review mutation with the author at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time This DTO family represents req-review-policies-5 order live reviews by publication time at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating This DTO family represents req-review-policies-6 calculate the live product rating at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion This DTO family represents req-review-policies-7 anonymize retained reviews after account deletion at the API boundary. Product review contract. @evidence docs/analysis/02-domain-model.md Represents shopping_reviews. *
 * @evidence prisma:shopping_reviews This DTO family exposes the shopping_reviews aggregate where the public contract needs it.
 */
export interface IShoppingReview {
  /**
   * Review UUID.
   * @evidence prisma:shopping_reviews.id Carries the persisted value represented by this DTO property.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Product identifier.
   * @evidence prisma:shopping_reviews.product_id Carries the persisted value represented by this DTO property.
   */
  productId: string & tags.Format<"uuid">;
  /**
   * Rating one through five.
   * @evidence prisma:shopping_reviews.rating Carries the persisted value represented by this DTO property.
   */
  rating: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<5>;
  /**
   * Optional text.
   * @evidence prisma:shopping_reviews.text Carries the persisted value represented by this DTO property.
   */
  text: null | string;
  /**
   * Current author presentation.
   * @evidence prisma:shopping_reviews.author_name Carries the persisted value represented by this DTO property.
   * @evidence prisma:shopping_reviews.shopping_customer_id Review responses are scoped to the customer relation.
   * @evidence prisma:shopping_reviews.shopping_order_item_id Review responses retain purchase relation.
   */
  authorName: string;
  /**
   * Publication state.
   * @evidence prisma:shopping_reviews.status Carries the persisted value represented by this DTO property.
   */
  status: string;
  /**
   * Creation instant.
   * @evidence prisma:shopping_reviews.created_at Carries the persisted value represented by this DTO property.
   */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IShoppingReview {
  /** Review creation input. @evidence docs/analysis/03-functional-requirements.md */
  export interface ICreate { orderItemId: string & tags.Format<"uuid">; rating: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<5>; text?: null | string; }
  /** Review update input. @evidence docs/analysis/03-functional-requirements.md */
  export interface IUpdate { rating: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<5>; text?: null | string; }
}
