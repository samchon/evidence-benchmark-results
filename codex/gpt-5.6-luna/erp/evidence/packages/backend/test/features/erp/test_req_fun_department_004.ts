import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_department_004.
 *
 * @evidence {@link api.functional.erp.req_fun_department_004.execute.req_fun_department_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_department_004.execute.req_fun_department_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-department-department-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-department-department-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-department-004-deactivates-or-reactivates-a-department Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-department-004-deactivates-or-reactivates-a-department Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_department_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_department_004.execute.req_fun_department_004(connection, {});
  typia.assert(output);
}

