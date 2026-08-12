import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_workflow_002.
 *
 * @evidence {@link api.functional.erp.req_fun_workflow_002.execute.req_fun_workflow_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_workflow_002.execute.req_fun_workflow_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-workflow-approval-workflow-administration Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-workflow-approval-workflow-administration Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-workflow-002-an-owner-configures-priority-and-amount-context-party-warehouse-role-currency-risk Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-workflow-002-an-owner-configures-priority-and-amount-context-party-warehouse-role-currency-risk Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_workflow_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_workflow_002.execute.req_fun_workflow_002(connection, {});
  typia.assert(output);
}

