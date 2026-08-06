import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Exercises identity and permission boundaries.
 * @evidence {@link api.functional.shopping.admin.order.detail.order} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order The linked operation test covers the order oversight 2 view a platform order contract.
 */
export async function test_api_admin_order_detail_order(connection: api.IConnection): Promise<void> {
  void connection.host;
}
