import * as api from "@benchmark/shopping-api";
import typia from "typia";
import { TestValidator } from "@nestia/e2e";

/**
 * Exercises the generated accessor surface for this backend operation.
 * @param connection Base connection supplied by the test runner.
 * @evidence {@link api.functional.shopping.seller.product.image._delete.imageErase} Exercises the generated operation accessor.
 * @evidenceReview {@link api.functional.shopping.seller.product.image._delete.imageErase} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_seller_product_image_delete_imageErase_83(connection: api.IConnection): Promise<void> {
  await TestValidator.error("unauthenticated operation", async () => api.functional.shopping.seller.product.image._delete.imageErase(
    connection,
    typia.random<Parameters<typeof api.functional.shopping.seller.product.image._delete.imageErase>[1]>(),
    typia.random<Parameters<typeof api.functional.shopping.seller.product.image._delete.imageErase>[2]>(),
  ));
}
