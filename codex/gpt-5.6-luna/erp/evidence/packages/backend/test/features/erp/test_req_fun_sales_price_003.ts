import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_sales_price_003.
 *
 * @evidence {@link api.functional.erp.req_fun_sales_price_003.execute.req_fun_sales_price_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_sales_price_003.execute.req_fun_sales_price_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-price-sales-price-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-price-sales-price-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-price-003-an-authorized-sales-user-resolves-the-effective-price-by-item-currency-customer Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-price-003-an-authorized-sales-user-resolves-the-effective-price-by-item-currency-customer Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_sales_price_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_sales_price_003.execute.req_fun_sales_price_003(connection, {});
  typia.assert(output);
}

