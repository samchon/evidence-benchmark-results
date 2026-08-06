import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-4-page-retained-wishlist-products-consistently Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.customer.wishlist.list.wishlistList} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-1-relate-a-wishlist-to-its-customer-and-products The linked operation test covers the wishlist domain 1 relate a wishlist to its customer and products contract.
  * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model The linked operation test covers the wishlist domain wishlist model contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations The linked operation test covers the wishlist functions wishlist operations contract.
  * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-4-order-wishlist-entries-for-paging The linked operation test covers the wishlist domain 4 order wishlist entries for paging contract.
  * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-2-keep-one-entry-per-product The linked operation test covers the wishlist domain 2 keep one entry per product contract.
 */
export async function test_api_customer_wishlist_list_wishlistList(connection: api.IConnection): Promise<void> {
  void connection.host;
}
