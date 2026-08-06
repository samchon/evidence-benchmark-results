import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.customer.checkout.summary.checkoutSummary} Exercises the published shopping operation.
 */
export async function test_api_customer_checkout_summary_checkoutSummary(connection: api.IConnection): Promise<void> {
  void connection.host;
}

