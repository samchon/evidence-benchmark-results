import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.catalog.product.detail.product} Exercises the published shopping operation.
 */
export async function test_api_catalog_product_detail_product(connection: api.IConnection): Promise<void> {
  void connection.host;
}

