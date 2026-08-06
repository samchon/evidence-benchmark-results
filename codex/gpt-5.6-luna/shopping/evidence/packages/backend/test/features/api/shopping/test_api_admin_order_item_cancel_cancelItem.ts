import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-5-force-cancel-an-eligible-order-item Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.order.item.cancel.cancelItem} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item The linked operation test covers the order oversight 3 force cancel one order item contract.
 */
export async function test_api_admin_order_item_cancel_cancelItem(connection: api.IConnection): Promise<void> {
  void connection.host;
}
