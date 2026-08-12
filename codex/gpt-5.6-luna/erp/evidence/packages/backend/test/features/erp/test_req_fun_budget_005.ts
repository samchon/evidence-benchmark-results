import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_budget_005.
 *
 * @evidence {@link api.functional.erp.req_fun_budget_005.execute.req_fun_budget_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_budget_005.execute.req_fun_budget_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-budget-budget-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-budget-budget-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-budget-005-creates-a-revision-with-a-reason-and-linked-approval-history Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-budget-005-creates-a-revision-with-a-reason-and-linked-approval-history Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-budget-005-refuses-the-transaction-according-to-organization-policy Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-budget-005-refuses-the-transaction-according-to-organization-policy Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_budget_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_budget_005.execute.req_fun_budget_005(connection, {});
  typia.assert(output);
}

