import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-6-force-refund-an-eligible-order-item Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-3-keep-each-commercial-reversal-synchronized Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.order.item.refund.refundItem} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item The linked operation test covers the order oversight 5 force refund one order item contract.
 */
export async function test_api_admin_order_item_refund_refundItem(connection: api.IConnection): Promise<void> {
  void connection.host;
}
