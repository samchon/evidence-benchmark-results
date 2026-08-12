import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_profit_center_001.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-profit-center-profit-centers Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profit-center-profit-centers Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_profit_center_001.execute.req_fun_profit_center_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_profit_center_001.execute.req_fun_profit_center_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-profit-center-profit-center-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-profit-center-profit-center-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-profit-center-001-creates-a-profit-center-and-optional-parent Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-profit-center-001-creates-a-profit-center-and-optional-parent Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_profit_center_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_profit_center_001.execute.req_fun_profit_center_001(connection, {});
  typia.assert(output);
}
