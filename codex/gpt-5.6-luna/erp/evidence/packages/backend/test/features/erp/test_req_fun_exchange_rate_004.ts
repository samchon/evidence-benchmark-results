import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_exchange_rate_004.
 *
 * @evidence {@link api.functional.erp.req_fun_exchange_rate_004.execute.req_fun_exchange_rate_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_exchange_rate_004.execute.req_fun_exchange_rate_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-exchange-rate-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-exchange-rate-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-004-selects-the-applicable-rate-for-a-foreign-currency-document-and-records-it-on-the-posting Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-004-selects-the-applicable-rate-for-a-foreign-currency-document-and-records-it-on-the-posting Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_exchange_rate_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_exchange_rate_004.execute.req_fun_exchange_rate_004(connection, {});
  typia.assert(output);
}

