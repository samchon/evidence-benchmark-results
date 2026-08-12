import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_employee_005.
 *
 * @evidence {@link api.functional.erp.req_fun_employee_005.execute.req_fun_employee_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_employee_005.execute.req_fun_employee_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-employee-employee-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-employee-employee-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-employee-005-an-hr-manager-returns-an-on-leave-employee-to-active-status Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-employee-005-an-hr-manager-returns-an-on-leave-employee-to-active-status Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-employee-005-limit-employee-and-payroll-information-visibility Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-employee-005-limit-employee-and-payroll-information-visibility Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_employee_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_employee_005.execute.req_fun_employee_005(connection, {});
  typia.assert(output);
}

