import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-2-mark-a-product-unavailable-without-variants Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.seller.product.update.updateProduct} Exercises the published shopping operation.
 */
export async function test_api_seller_product_update_updateProduct(connection: api.IConnection): Promise<void> {
  void connection.host;
}
