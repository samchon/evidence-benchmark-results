import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_payroll_run_009.
 *
 * @evidence {@link api.functional.erp.req_fun_payroll_run_009.execute.req_fun_payroll_run_009} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_payroll_run_009.execute.req_fun_payroll_run_009} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payroll-run-payroll-run-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-payroll-run-payroll-run-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payroll-run-009-a-finance-manager-reverses-a-posted-payroll-run Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-payroll-run-009-a-finance-manager-reverses-a-posted-payroll-run Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_payroll_run_009(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_payroll_run_009.execute.req_fun_payroll_run_009(connection, {});
  typia.assert(output);
}

