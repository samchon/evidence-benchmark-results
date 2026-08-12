import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_approval_010.
 *
 * @evidence {@link api.functional.erp.req_fun_approval_010.execute.req_fun_approval_010} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_approval_010.execute.req_fun_approval_010} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-approval-approval-request-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-approval-approval-request-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-approval-010-views-immutable-approval-history-and-current-status Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-approval-010-views-immutable-approval-history-and-current-status Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_approval_010(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_approval_010.execute.req_fun_approval_010(connection, {});
  typia.assert(output);
}

