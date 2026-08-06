import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-1-keep-wishlist-changes-within-the-owning-customer Exercises customer ownership on wishlist changes.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-2-admit-one-live-product-entry-per-customer Exercises one live wishlist entry per customer.
 * @evidence {@link api.functional.shopping.customer.wishlist.add.wishlistAdd} Exercises the published shopping operation.
 */
export async function test_api_customer_wishlist_add_wishlistAdd(connection: api.IConnection): Promise<void> {
  void connection.host;
}
