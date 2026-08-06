import type { tags } from "typia";

/**
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model This DTO family represents req-cart-domain shopping cart model at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-2-keep-one-line-per-variant This DTO family represents req-cart-domain-2 keep one line per variant at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-3-present-cart-line-values This DTO family represents req-cart-domain-3 present cart-line values at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-4-calculate-the-cart-total This DTO family represents req-cart-domain-4 calculate the cart total at the API boundary.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-5-expose-cart-availability-problems This DTO family represents req-cart-domain-5 expose cart availability problems at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations This DTO family represents req-cart-functions shopping cart operations at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart This DTO family represents req-cart-functions-1 add a variant to the cart at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-2-view-the-shopping-cart This DTO family represents req-cart-functions-2 view the shopping cart at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-3-change-cart-quantity This DTO family represents req-cart-functions-3 change cart quantity at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-4-remove-a-cart-line This DTO family represents req-cart-functions-4 remove a cart line at the API boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-6-commit-stock-and-cart-effects This DTO family represents req-checkout-journey-6 commit stock and cart effects at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies This DTO family represents req-cart-policies cart quantity and availability policies at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-1-require-a-positive-whole-unit-cart-quantity This DTO family represents req-cart-policies-1 require a positive whole-unit cart quantity at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions This DTO family represents req-cart-policies-2 merge repeated variant additions at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-3-admit-only-a-purchasable-live-variant This DTO family represents req-cart-policies-3 admit only a purchasable live variant at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-4-expose-current-cart-price-and-availability This DTO family represents req-cart-policies-4 expose current cart price and availability at the API boundary.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-5-exclude-ineligible-lines-from-checkout This DTO family represents req-cart-policies-5 exclude ineligible lines from checkout at the API boundary. Customer cart and current availability contract. @evidence docs/analysis/02-domain-model.md Represents shopping_carts and shopping_cart_lines. *
 * @evidence prisma:shopping_carts This DTO family exposes the shopping_carts aggregate where the public contract needs it.
 * @evidence prisma:shopping_cart_lines This DTO family exposes the shopping_cart_lines aggregate where the public contract needs it.
 */
export interface IShoppingCart {
  /**
   * Cart UUID.
   * @evidence prisma:shopping_carts.id Carries the persisted value represented by this DTO property.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Current cart lines.
   */
  lines: IShoppingCart.ILine[];
  /** Current total. @evidence docs/analysis/02-domain-model.md */
  total: number;
}
export namespace IShoppingCart {
  /**
   * Cart line.
   */
  export interface ILine {
    /**
     * Line id.
     * @evidence prisma:shopping_cart_lines.id Carries the persisted value represented by this DTO property.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Variant identity.
     * @evidence prisma:shopping_cart_lines.shopping_product_variant_id Carries the persisted value represented by this DTO property.
     */
    variantId: string & tags.Format<"uuid">;
    /**
     * Requested units.
     * @evidence prisma:shopping_cart_lines.quantity Carries the persisted value represented by this DTO property.
     */
    quantity: number & tags.Type<"uint32">;
    /**
     * Current variant price.
     * @evidence prisma:shopping_product_variants.price_override Carries the persisted value represented by this DTO property.
     */
    price: number;
    /**
     * Current availability.
     * @evidence prisma:shopping_product_variants.status Carries the persisted value represented by this DTO property.
     */
    available: boolean;
  }
  /** Add or merge a line. @evidence docs/analysis/03-functional-requirements.md */
  export interface ICreate { variantId: string & tags.Format<"uuid">; quantity: number & tags.Type<"uint32"> & tags.Minimum<1>; }
  /** Change line quantity. @evidence docs/analysis/03-functional-requirements.md */
  export interface IUpdate { quantity: number & tags.Type<"uint32"> & tags.Minimum<1>; }
}
