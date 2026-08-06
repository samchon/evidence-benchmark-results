import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.catalog.seller.profile.seller} Exercises the published shopping operation.
 */
export async function test_api_catalog_seller_profile_seller(connection: api.IConnection): Promise<void> {
  void connection.host;
}

