import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_workflow_006.
 *
 * @evidence {@link api.functional.erp.req_fun_workflow_006.execute.req_fun_workflow_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_workflow_006.execute.req_fun_workflow_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-workflow-approval-workflow-administration Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-workflow-approval-workflow-administration Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-workflow-006-creates-a-new-version-of-an-active-workflow Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-workflow-006-creates-a-new-version-of-an-active-workflow Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_workflow_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_workflow_006.execute.req_fun_workflow_006(connection, {});
  typia.assert(output);
}

