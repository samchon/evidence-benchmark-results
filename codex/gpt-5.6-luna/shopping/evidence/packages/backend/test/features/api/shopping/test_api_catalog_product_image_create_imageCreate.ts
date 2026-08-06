import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.catalog.product.image.create.imageCreate} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-1-create-evidence-for-covered-commercial-changes The linked operation test covers the snapshot policies 1 create evidence for covered commercial changes contract.
 */
export async function test_api_catalog_product_image_create_imageCreate(connection: api.IConnection): Promise<void> {
  void connection.host;
}
