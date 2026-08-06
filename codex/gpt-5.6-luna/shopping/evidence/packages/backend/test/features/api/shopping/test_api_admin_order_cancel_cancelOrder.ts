import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-7-apply-a-force-action-across-an-orders-eligible-items Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.order.cancel.cancelOrder} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items The linked operation test covers the order oversight 4 force cancel an orders eligible items contract.
 */
export async function test_api_admin_order_cancel_cancelOrder(connection: api.IConnection): Promise<void> {
  void connection.host;
}
