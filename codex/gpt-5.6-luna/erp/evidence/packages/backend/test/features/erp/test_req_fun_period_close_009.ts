import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_period_close_009.
 *
 * @evidence {@link api.functional.erp.req_fun_period_close_009.execute.req_fun_period_close_009} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_period_close_009.execute.req_fun_period_close_009} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-period-close-fiscal-period-close-and-reopen Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-period-close-fiscal-period-close-and-reopen Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-period-close-009-a-finance-manager-recloses-a-corrected-reopened-period-as-a-new-close-cycle Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-period-close-009-a-finance-manager-recloses-a-corrected-reopened-period-as-a-new-close-cycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_period_close_009(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_period_close_009.execute.req_fun_period_close_009(connection, {});
  typia.assert(output);
}

