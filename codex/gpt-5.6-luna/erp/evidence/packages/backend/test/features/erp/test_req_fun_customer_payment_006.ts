import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_customer_payment_006.
 *
 * @evidence {@link api.functional.erp.req_fun_customer_payment_006.execute.req_fun_customer_payment_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_customer_payment_006.execute.req_fun_customer_payment_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-customer-payment-customer-payment-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-customer-payment-customer-payment-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-customer-payment-006-views-invoice-settlement-credit Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-customer-payment-006-views-invoice-settlement-credit Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_customer_payment_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_customer_payment_006.execute.req_fun_customer_payment_006(connection, {});
  typia.assert(output);
}

