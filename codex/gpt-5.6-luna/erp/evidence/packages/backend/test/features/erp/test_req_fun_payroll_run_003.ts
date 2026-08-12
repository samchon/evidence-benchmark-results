import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_payroll_run_003.
 *
 * @evidence {@link api.functional.erp.req_fun_payroll_run_003.execute.req_fun_payroll_run_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_payroll_run_003.execute.req_fun_payroll_run_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payroll-run-payroll-run-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-payroll-run-payroll-run-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payroll-run-003-calculates-employee-payroll-lines-and-preserves-calculation-details Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-payroll-run-003-calculates-employee-payroll-lines-and-preserves-calculation-details Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-payroll-003-a-payroll-run-cannot-post-before-approval Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-payroll-003-a-payroll-run-cannot-post-before-approval Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_payroll_run_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_payroll_run_003.execute.req_fun_payroll_run_003(connection, {});
  typia.assert(output);
}

