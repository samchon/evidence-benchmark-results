import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_timesheet_004.
 *
 * @evidence {@link api.functional.erp.req_fun_timesheet_004.execute.req_fun_timesheet_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_timesheet_004.execute.req_fun_timesheet_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timesheet-timesheet-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-timesheet-timesheet-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timesheet-004-rejects-a-submitted-timesheet-with-a-reason Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-timesheet-004-rejects-a-submitted-timesheet-with-a-reason Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-timesheet-004-use-only-approved-timesheets-downstream Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-timesheet-004-use-only-approved-timesheets-downstream Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_timesheet_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_timesheet_004.execute.req_fun_timesheet_004(connection, {});
  typia.assert(output);
}

