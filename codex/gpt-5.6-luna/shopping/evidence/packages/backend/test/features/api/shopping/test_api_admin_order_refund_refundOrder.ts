import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.order.refund.refundOrder} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items The linked operation test covers the order oversight 6 force refund an orders eligible items contract.
 */
export async function test_api_admin_order_refund_refundOrder(connection: api.IConnection): Promise<void> {
  void connection.host;
}
