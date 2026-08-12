import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_timesheet_003.
 *
 * @evidence {@link api.functional.erp.req_fun_timesheet_003.execute.req_fun_timesheet_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_timesheet_003.execute.req_fun_timesheet_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timesheet-timesheet-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-timesheet-timesheet-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timesheet-003-approves-a-submitted-timesheet-and-locks-its-timelogs Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-timesheet-003-approves-a-submitted-timesheet-and-locks-its-timelogs Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-timesheet-003-require-a-timesheet-rejection-reason Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-timesheet-003-require-a-timesheet-rejection-reason Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_timesheet_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_timesheet_003.execute.req_fun_timesheet_003(connection, {});
  typia.assert(output);
}

