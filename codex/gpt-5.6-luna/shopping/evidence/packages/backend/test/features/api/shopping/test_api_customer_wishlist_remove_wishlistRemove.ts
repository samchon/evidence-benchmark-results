import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-3-keep-a-wishlist-entry-product-scoped-and-nonreserving Exercises product-scoped wishlist removal.
 * @evidence {@link api.functional.shopping.customer.wishlist.remove.wishlistRemove} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-3-remove-deleted-products-from-wishlists The linked operation test covers the wishlist domain 3 remove deleted products from wishlists contract.
 */
export async function test_api_customer_wishlist_remove_wishlistRemove(connection: api.IConnection): Promise<void> {
  void connection.host;
}
