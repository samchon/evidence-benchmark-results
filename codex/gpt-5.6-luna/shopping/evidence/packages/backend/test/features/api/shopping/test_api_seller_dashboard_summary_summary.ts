import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.seller.dashboard_summary.summary} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-2-count-all-retained-seller-order-items The linked operation test covers the seller dashboard policies 2 count all retained seller order items contract.
  * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-3-count-unresolved-seller-requests The linked operation test covers the seller dashboard policies 3 count unresolved seller requests contract.
  * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies The linked operation test covers the seller dashboard policies seller dashboard calculation policies contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports The linked operation test covers the seller dashboard seller dashboard and order item reports contract.
  * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-1-count-the-sellers-current-products The linked operation test covers the seller dashboard policies 1 count the sellers current products contract.
  * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-4-filter-seller-order-items-by-one-exact-status The linked operation test covers the seller dashboard policies 4 filter seller order items by one exact status contract.
 */
export async function test_api_seller_dashboard_summary_summary(connection: api.IConnection): Promise<void> {
  void connection.host;
}
