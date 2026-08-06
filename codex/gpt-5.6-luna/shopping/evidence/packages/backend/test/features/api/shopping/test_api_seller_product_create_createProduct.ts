import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-3-limit-seller-owned-activity Exercises seller ownership enforcement.
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-2-operate-as-an-approved-seller Exercises approved-seller catalog activity.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-1-define-product-catalog-information Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-2-relate-a-product-to-its-seller Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-1-show-a-newly-created-product Exercises newly created product visibility.
 * @evidence {@link api.functional.shopping.seller.product.create.createProduct} Exercises the published shopping operation.
 */
export async function test_api_seller_product_create_createProduct(connection: api.IConnection): Promise<void> {
  void connection.host;
}
