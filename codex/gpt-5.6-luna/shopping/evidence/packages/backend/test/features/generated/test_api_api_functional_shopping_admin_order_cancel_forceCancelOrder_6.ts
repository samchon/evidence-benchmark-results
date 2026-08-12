import * as api from "@benchmark/shopping-api";
import typia from "typia";
import { TestValidator } from "@nestia/e2e";

/**
 * Exercises the generated accessor surface for this backend operation.
 * @param connection Base connection supplied by the test runner.
 * @evidence {@link api.functional.shopping.admin.order.cancel.forceCancelOrder} Exercises the generated operation accessor.
 * @evidenceReview {@link api.functional.shopping.admin.order.cancel.forceCancelOrder} Read the generated accessor and this test body; confirmed that the cited operation is the sole operation invoked and that the asserted response or refusal is the checked behavior.
 */
export async function test_api_api_functional_shopping_admin_order_cancel_forceCancelOrder_6(connection: api.IConnection): Promise<void> {
  await TestValidator.error("unauthenticated operation", async () => api.functional.shopping.admin.order.cancel.forceCancelOrder(
    connection,
    typia.random<Parameters<typeof api.functional.shopping.admin.order.cancel.forceCancelOrder>[1]>(),
    typia.random<Parameters<typeof api.functional.shopping.admin.order.cancel.forceCancelOrder>[2]>(),
  ));
}
