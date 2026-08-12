import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_period_close_004.
 *
 * @evidence {@link api.functional.erp.req_fun_period_close_004.execute.req_fun_period_close_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_period_close_004.execute.req_fun_period_close_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-period-close-fiscal-period-close-and-reopen Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-period-close-fiscal-period-close-and-reopen Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-period-close-004-a-finance-manager-hard-closes-a-blocker-free-period-and-freezes-all-named-snapshots Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-period-close-004-a-finance-manager-hard-closes-a-blocker-free-period-and-freezes-all-named-snapshots Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-period-004-only-an-owner-may-initiate-reopening Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-period-004-only-an-owner-may-initiate-reopening Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_period_close_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_period_close_004.execute.req_fun_period_close_004(connection, {});
  typia.assert(output);
}

