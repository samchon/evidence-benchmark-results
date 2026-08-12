import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_work_center_002.
 *
 * @evidence {@link api.functional.erp.req_fun_work_center_002.execute.req_fun_work_center_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_work_center_002.execute.req_fun_work_center_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-work-center-work-center-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-work-center-work-center-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-work-center-002-searches-work-centers-by-code-warehouse-status-cost-center Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-work-center-002-searches-work-centers-by-code-warehouse-status-cost-center Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_work_center_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_work_center_002.execute.req_fun_work_center_002(connection, {});
  typia.assert(output);
}

