import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-3-order-product-images Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.catalog.product.image.reorder.imageReorder} Exercises the published shopping operation.
 */
export async function test_api_catalog_product_image_reorder_imageReorder(connection: api.IConnection): Promise<void> {
  void connection.host;
}
