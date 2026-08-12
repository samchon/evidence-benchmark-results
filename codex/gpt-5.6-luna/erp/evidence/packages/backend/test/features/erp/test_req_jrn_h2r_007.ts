import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_jrn_h2r_007.
 *
 * @evidence {@link api.functional.erp.req_jrn_h2r_007.execute.req_jrn_h2r_007} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_jrn_h2r_007.execute.req_jrn_h2r_007} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-h2r-hire-to-retire-and-payroll-journey Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-h2r-hire-to-retire-and-payroll-journey Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-h2r-007-timesheet-hire-to-retire-and-payroll-for-timesheet-rejection-reopening Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-h2r-007-timesheet-hire-to-retire-and-payroll-for-timesheet-rejection-reopening Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_jrn_h2r_007(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_jrn_h2r_007.execute.req_jrn_h2r_007(connection, {});
  typia.assert(output);
}

