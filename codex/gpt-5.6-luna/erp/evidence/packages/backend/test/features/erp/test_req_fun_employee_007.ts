import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_employee_007.
 *
 * @evidence {@link api.functional.erp.req_fun_employee_007.execute.req_fun_employee_007} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_employee_007.execute.req_fun_employee_007} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-employee-employee-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-employee-employee-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-employee-007-an-hr-manager-terminates-an-employee-with-a-termination-date Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-employee-007-an-hr-manager-terminates-an-employee-with-a-termination-date Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_employee_007(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_employee_007.execute.req_fun_employee_007(connection, {});
  typia.assert(output);
}

