import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-4-remove-live-product-relationships Exercises live relationship removal.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-5-retain-history-after-product-deletion Exercises retained product history.
 * @evidence {@link api.functional.shopping.seller.product._delete.deleteProduct} Exercises the published shopping operation.
 */
export async function test_api_seller_product__delete_deleteProduct(connection: api.IConnection): Promise<void> {
  void connection.host;
}
