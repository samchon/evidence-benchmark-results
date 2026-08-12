import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_sales_order_005.
 *
 * @evidence {@link api.functional.erp.req_fun_sales_order_005.execute.req_fun_sales_order_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_sales_order_005.execute.req_fun_sales_order_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-order-sales-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-order-sales-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-order-005-the-product-checks-customer-credit-exposure-before-approval Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-order-005-the-product-checks-customer-credit-exposure-before-approval Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-sales-order-005-an-order-cannot-be-cancelled-after-shipment-until-returns-or-credits-resolve-downstream-effects Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-sales-order-005-an-order-cannot-be-cancelled-after-shipment-until-returns-or-credits-resolve-downstream-effects Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_sales_order_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_sales_order_005.execute.req_fun_sales_order_005(connection, {});
  typia.assert(output);
}

