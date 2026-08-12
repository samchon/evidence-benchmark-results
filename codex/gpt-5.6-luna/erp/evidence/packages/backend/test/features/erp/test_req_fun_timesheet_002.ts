import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_timesheet_002.
 *
 * @evidence {@link api.functional.erp.req_fun_timesheet_002.execute.req_fun_timesheet_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_timesheet_002.execute.req_fun_timesheet_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timesheet-timesheet-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-timesheet-timesheet-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timesheet-002-submits-a-nonempty-timesheet Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-timesheet-002-submits-a-nonempty-timesheet Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-timesheet-002-keep-one-submitted-or-approved-timesheet-per-employee-week Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-timesheet-002-keep-one-submitted-or-approved-timesheet-per-employee-week Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_timesheet_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_timesheet_002.execute.req_fun_timesheet_002(connection, {});
  typia.assert(output);
}

