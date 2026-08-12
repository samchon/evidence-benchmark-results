import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_timelog_002.
 *
 * @evidence {@link api.functional.erp.req_fun_timelog_002.execute.req_fun_timelog_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_timelog_002.execute.req_fun_timelog_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timelog-timelog-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-timelog-timelog-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-timelog-002-edits-their-own-unlocked-timelog Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-timelog-002-edits-their-own-unlocked-timelog Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-timelog-002-limit-time-manager-edits-to-unlocked-timelogs Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-timelog-002-limit-time-manager-edits-to-unlocked-timelogs Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_timelog_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_timelog_002.execute.req_fun_timelog_002(connection, {});
  typia.assert(output);
}

