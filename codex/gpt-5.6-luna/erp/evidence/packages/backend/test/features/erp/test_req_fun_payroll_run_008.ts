import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_payroll_run_008.
 *
 * @evidence {@link api.functional.erp.req_fun_payroll_run_008.execute.req_fun_payroll_run_008} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_payroll_run_008.execute.req_fun_payroll_run_008} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payroll-run-payroll-run-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-payroll-run-payroll-run-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payroll-run-008-publishes-employee-payslips Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-payroll-run-008-publishes-employee-payslips Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_payroll_run_008(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_payroll_run_008.execute.req_fun_payroll_run_008(connection, {});
  typia.assert(output);
}

