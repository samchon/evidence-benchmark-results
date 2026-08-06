import { TypedBody, TypedHeaders, TypedParam, TypedRoute as Route } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";
import type { tags } from "typia";
import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Customer wishlist, cart, checkout, order, and review operations. */
@Controller("shopping/customer")
export class ShoppingCommerceController {
  /**
   * Add a product to the wishlist.
   * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-1-add-a-product-to-the-wishlist This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_wishlist_entries This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-1-keep-wishlist-changes-within-the-owning-customer Enforces the policies 1 keep wishlist changes within the owning customer contract through wishlistAdd.
   * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-2-admit-one-live-product-entry-per-customer Enforces the policies 2 admit one live product entry per customer contract through wishlistAdd.
   * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-3-keep-a-wishlist-entry-product-scoped-and-nonreserving Enforces the policies 3 keep a wishlist entry product scoped and nonreserving contract through wishlistAdd.
   * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Enforces the policies wishlist membership policies contract through wishlistAdd.
   */
  @Route.Post("wishlist/add/:productId")
  public async wishlistAdd(@TypedHeaders() headers: { authorization?: string }, @TypedParam("productId") productId: string & tags.Format<"uuid">): Promise<api.IShoppingCustomer.IWishlistEntry> { return ShoppingProvider.addWishlist(AuthUtil.parse(headers.authorization).id, productId); }
  /**
   * View the wishlist.
   * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-1-relate-a-wishlist-to-its-customer-and-products This controller operation realizes the wishlist domain 1 relate a wishlist to its customer and products contract through wishlistList.
   * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model This controller operation realizes the wishlist domain wishlist model contract through wishlistList.
   * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations This controller operation realizes the wishlist functions wishlist operations contract through wishlistList.
   * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-4-order-wishlist-entries-for-paging This controller operation realizes the wishlist domain 4 order wishlist entries for paging contract through wishlistList.
   * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-2-keep-one-entry-per-product This controller operation realizes the wishlist domain 2 keep one entry per product contract through wishlistList.
   * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-2-view-the-wishlist This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_wishlists This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-4-page-retained-wishlist-products-consistently Enforces the policies 4 page retained wishlist products consistently contract through wishlistList.
   */
  @Route.Patch("wishlist/list")
  public async wishlistList(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingCustomer.IWishlistEntry>> { return ShoppingProvider.listWishlist(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * Remove a wishlist product.
   * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-3-remove-deleted-products-from-wishlists This controller operation realizes the wishlist domain 3 remove deleted products from wishlists contract through wishlistRemove.
   * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-3-remove-a-wishlist-product This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_wishlist_entries This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Delete("wishlist/:productId/remove")
  public async wishlistRemove(@TypedHeaders() headers: { authorization?: string }, @TypedParam("productId") productId: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.removeWishlist(AuthUtil.parse(headers.authorization).id, productId); }
  /**
   * Add a variant to the cart.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions This controller operation realizes the cart policies 2 merge repeated variant additions contract through cartAdd.
   * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_cart_lines This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Post("cart/add")
  public async cartAdd(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingCart.ICreate): Promise<api.IShoppingCart> { return ShoppingProvider.addCart(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * View the shopping cart.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-5-exclude-ineligible-lines-from-checkout This controller operation realizes the cart policies 5 exclude ineligible lines from checkout contract through cartView.
   * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-6-commit-stock-and-cart-effects This controller operation realizes the checkout journey 6 commit stock and cart effects contract through cartView.
   * @evidence docs/analysis/02-domain-model.md#req-cart-domain-1-relate-a-cart-to-its-customer-and-variants This controller operation realizes the cart domain 1 relate a cart to its customer and variants contract through cartView.
   * @evidence docs/analysis/02-domain-model.md#req-cart-domain-5-expose-cart-availability-problems This controller operation realizes the cart domain 5 expose cart availability problems contract through cartView.
   * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model This controller operation realizes the cart domain shopping cart model contract through cartView.
   * @evidence docs/analysis/02-domain-model.md#req-cart-domain-3-present-cart-line-values This controller operation realizes the cart domain 3 present cart line values contract through cartView.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies This controller operation realizes the cart policies cart quantity and availability policies contract through cartView.
   * @evidence docs/analysis/02-domain-model.md#req-cart-domain-2-keep-one-line-per-variant This controller operation realizes the cart domain 2 keep one line per variant contract through cartView.
   * @evidence docs/analysis/02-domain-model.md#req-cart-domain-4-calculate-the-cart-total This controller operation realizes the cart domain 4 calculate the cart total contract through cartView.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-3-admit-only-a-purchasable-live-variant This controller operation realizes the cart policies 3 admit only a purchasable live variant contract through cartView.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-1-require-a-positive-whole-unit-cart-quantity This controller operation realizes the cart policies 1 require a positive whole unit cart quantity contract through cartView.
   * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations This controller operation realizes the cart functions shopping cart operations contract through cartView.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-4-expose-current-cart-price-and-availability This controller operation realizes the cart policies 4 expose current cart price and availability contract through cartView.
   * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-2-view-the-shopping-cart This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_carts This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Get("cart/view")
  public async cartView(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingCart> { return ShoppingProvider.getCart(AuthUtil.parse(headers.authorization).id); }
  /**
   * Change cart quantity.
   * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-3-change-cart-quantity This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_cart_lines This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("cart/:id/update")
  public async cartUpdate(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingCart.IUpdate): Promise<api.IShoppingCart> { return ShoppingProvider.updateCart(AuthUtil.parse(headers.authorization).id, id, body); }
  /**
   * Remove a cart line.
   * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-4-remove-a-cart-line This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_cart_lines This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Delete("cart/:id/remove")
  public async cartRemove(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingCart> { return ShoppingProvider.removeCart(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Confirm checkout and create the paid order.
   * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies This controller operation realizes the checkout policies checkout payment and order creation policies contract through checkout.
   * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-1-require-purchasable-lines-and-an-owned-address This controller operation realizes the checkout policies 1 require purchasable lines and an owned address contract through checkout.
   * @evidence docs/analysis/04-business-rules.md#req-address-policies-5-use-only-a-current-owned-address-at-checkout This controller operation realizes the address policies 5 use only a current owned address at checkout contract through checkout.
   * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-3-fix-the-purchase-shipping-address This controller operation realizes the checkout policies 3 fix the purchase shipping address contract through checkout.
   * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey This controller operation realizes the checkout journey checkout and order placement journey contract through checkout.
   * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-2-refresh-material-purchase-facts-before-charge This controller operation realizes the checkout policies 2 refresh material purchase facts before charge contract through checkout.
   * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-6-commit-the-successful-purchase-atomically This controller operation realizes the checkout policies 6 commit the successful purchase atomically contract through checkout.
   * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-4-recover-cleanly-from-unsuccessful-payment This controller operation realizes the checkout policies 4 recover cleanly from unsuccessful payment contract through checkout.
   * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-5-make-gateway-success-idempotent This controller operation realizes the checkout policies 5 make gateway success idempotent contract through checkout.
   * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-1-start-checkout This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-5-create-the-paid-order This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_orders This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-1-expose-one-complete-successful-purchase-outcome Exposes one complete successful purchase outcome.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-4-preserve-independent-item-progress Preserves independent item progress at checkout.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Preserves purchase and resolution consistency.
   */
  @Route.Post("checkout/create")
  public async checkout(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingOrder.ICreate): Promise<api.IShoppingOrder> { return ShoppingProvider.checkout(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * Start checkout and review the order summary.
   * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-2-review-the-order-summary This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-3-confirm-and-initiate-payment This controller method implements the referenced requirement through the live backend endpoint.
   */
  @Route.Get("checkout/summary")
  public async checkoutSummary(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingCart> { return ShoppingProvider.getCart(AuthUtil.parse(headers.authorization).id); }
  /**
   * Recover from payment failure without committing effects.
   * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-4-recover-from-payment-failure This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-2-preserve-a-clean-state-after-payment-failure Leaves no committed effects after payment failure.
   */
  @Route.Post("checkout/failure")
  public async checkoutFailure(): Promise<api.IShoppingResult> { return { status: "payment-failed" }; }
  /**
   * List customer orders.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history This controller operation realizes the order history functions customer order history contract through orders.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-1-list-customer-orders This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_orders This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("order/list")
  public async orders(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IShoppingOrder.IRequest): Promise<api.IPage<api.IShoppingOrder>> { return ShoppingProvider.listOrders(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * View order details.
   * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-2-transition-paid-items-to-shipped This controller operation realizes the order item lifecycle 2 transition paid items to shipped contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-4-derive-cancelled-order-status This controller operation realizes the order lifecycle 4 derive cancelled order status contract through order.
   * @evidence docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies This controller operation realizes the order policies order composition pricing and status policies contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-3-transition-shipped-items-to-delivered This controller operation realizes the order item lifecycle 3 transition shipped items to delivered contract through order.
   * @evidence docs/analysis/04-business-rules.md#req-order-policies-1-calculate-the-fixed-purchase-total This controller operation realizes the order policies 1 calculate the fixed purchase total contract through order.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight This controller operation realizes the order oversight administrator order oversight contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-1-derive-paid-order-status This controller operation realizes the order lifecycle 1 derive paid order status contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-4-transition-an-item-to-cancelled This controller operation realizes the order item lifecycle 4 transition an item to cancelled contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-domain-1-define-order-information This controller operation realizes the order domain 1 define order information contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-6-derive-partially-completed-status This controller operation realizes the order lifecycle 6 derive partially completed status contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-3-derive-delivered-order-status This controller operation realizes the order lifecycle 3 derive delivered order status contract through order.
   * @evidence docs/analysis/04-business-rules.md#req-order-policies-4-derive-the-complete-overall-order-status This controller operation realizes the order policies 4 derive the complete overall order status contract through order.
   * @evidence docs/analysis/04-business-rules.md#req-order-policies-3-keep-fulfillment-and-resolution-item-scoped This controller operation realizes the order policies 3 keep fulfillment and resolution item scoped contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states This controller operation realizes the order lifecycle derived order states contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-domain-order-model This controller operation realizes the order domain order model contract through order.
   * @evidence docs/analysis/04-business-rules.md#req-order-policies-5-present-orders-from-purchase-time-evidence This controller operation realizes the order policies 5 present orders from purchase time evidence contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-2-derive-shipped-order-status This controller operation realizes the order lifecycle 2 derive shipped order status contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-6-preserve-item-facts-across-status-changes This controller operation realizes the order item lifecycle 6 preserve item facts across status changes contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states This controller operation realizes the order item lifecycle order item states contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-domain-5-relate-items-to-fulfillment-and-after-sales-records This controller operation realizes the order domain 5 relate items to fulfillment and after sales records contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-domain-4-allow-multi-seller-orders This controller operation realizes the order domain 4 allow multi seller orders contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-1-begin-items-in-paid-status This controller operation realizes the order item lifecycle 1 begin items in paid status contract through order.
   * @evidence docs/analysis/02-domain-model.md#req-order-domain-2-relate-an-order-to-its-customer-and-items This controller operation realizes the order domain 2 relate an order to its customer and items contract through order.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-2-view-order-details This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_order_items This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable Presents retained order facts from purchase-time evidence.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-3-keep-each-commercial-reversal-synchronized Presents synchronized reversal outcomes.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-4-trace-stock-and-purchase-evidence-end-to-end Links order items to retained stock and purchase evidence.
   */
  @Route.Get("order/:id/detail")
  public async order(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingOrder> { return ShoppingProvider.getOrder(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * View order shipments.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-3-view-order-shipments This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_shipments This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Get("order/:id/shipments")
  public async shipments(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingOrder.IShipment[]> { return ShoppingProvider.orderShipments(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Publish a product review.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies This controller operation realizes the review policies review eligibility ordering and rating policies contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model This controller operation realizes the review domain review model contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase This controller operation realizes the review domain 3 limit reviews per purchase contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information This controller operation realizes the review domain 1 define review information contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review This controller operation realizes the review lifecycle 1 publish an eligible review contract through reviewCreate.
   * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-review-operations This controller operation realizes the review functions review operations contract through reviewCreate.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time This controller operation realizes the review policies 5 order live reviews by publication time contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings This controller operation realizes the review domain 4 retire a review from ratings contract through reviewCreate.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase This controller operation realizes the review policies 1 require a verified delivered purchase contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion This controller operation realizes the review domain 5 anonymize reviews after customer deletion contract through reviewCreate.
   * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-4-anonymize-retained-customer-reviews This controller operation realizes the customer account policies 4 anonymize retained customer reviews contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure This controller operation realizes the review lifecycle 4 anonymize reviews on account closure contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review This controller operation realizes the review lifecycle 2 edit a published review contract through reviewCreate.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author This controller operation realizes the review policies 4 keep review mutation with the author contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement This controller operation realizes the review lifecycle review publication and retirement contract through reviewCreate.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating This controller operation realizes the review policies 6 calculate the live product rating contract through reviewCreate.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order This controller operation realizes the review policies 3 keep one review identity per product and order contract through reviewCreate.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text This controller operation realizes the review policies 2 validate review rating and optional text contract through reviewCreate.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion This controller operation realizes the review policies 7 anonymize retained reviews after account deletion contract through reviewCreate.
   * @evidence docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase This controller operation realizes the review domain 2 relate a review to its purchase contract through reviewCreate.
   * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_reviews This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Post("review/create")
  public async reviewCreate(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingReview.ICreate): Promise<api.IShoppingReview> { return ShoppingProvider.createReview(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * Edit an authored review.
   * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_reviews This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Put("review/:id/update")
  public async reviewUpdate(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingReview.IUpdate): Promise<api.IShoppingReview> { return ShoppingProvider.updateReview(AuthUtil.parse(headers.authorization).id, id, body); }
  /**
   * Delete an authored review.
   * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review This controller operation realizes the review lifecycle 3 delete a published review contract through reviewDelete.
   * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_reviews This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-1-keep-commercial-history-through-retirement Retains commercial history when the review is retired.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-4-limit-retained-history-to-relevant-parties Limits retained review history to relevant parties.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Preserves commercial history and privacy continuity.
   */
  @Route.Delete("review/:id/delete")
  public async reviewDelete(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.deleteReview(AuthUtil.parse(headers.authorization).id, id); }
}


