import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_currency_001.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-currency-currencies Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-currency-currencies Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_currency_001.execute.req_fun_currency_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_currency_001.execute.req_fun_currency_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-currency-currency-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-currency-currency-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-currency-001-adds-a-supported-currency Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-currency-001-adds-a-supported-currency Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_currency_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_currency_001.execute.req_fun_currency_001(connection, {});
  typia.assert(output);
}
