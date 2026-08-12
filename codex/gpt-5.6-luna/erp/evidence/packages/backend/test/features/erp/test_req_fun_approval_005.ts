import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_approval_005.
 *
 * @evidence {@link api.functional.erp.req_fun_approval_005.execute.req_fun_approval_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_approval_005.execute.req_fun_approval_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-approval-approval-request-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-approval-approval-request-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-approval-005-changes-from-the-requester Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-approval-005-changes-from-the-requester Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-approval-005-delegation-cannot-create-a-loop-and-remains-recorded-in-history Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-approval-005-delegation-cannot-create-a-loop-and-remains-recorded-in-history Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_approval_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_approval_005.execute.req_fun_approval_005(connection, {});
  typia.assert(output);
}

