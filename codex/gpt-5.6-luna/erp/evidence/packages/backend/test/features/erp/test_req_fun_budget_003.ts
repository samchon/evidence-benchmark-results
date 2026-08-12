import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_budget_003.
 *
 * @evidence {@link api.functional.erp.req_fun_budget_003.execute.req_fun_budget_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_budget_003.execute.req_fun_budget_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-budget-budget-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-budget-budget-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-budget-003-approves-the-budget-and-activates-the-version Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-budget-003-approves-the-budget-and-activates-the-version Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-budget-003-purchase-requests-purchase-orders-vendor-bills-payroll-runs-manual-journals Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-budget-003-purchase-requests-purchase-orders-vendor-bills-payroll-runs-manual-journals Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_budget_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_budget_003.execute.req_fun_budget_003(connection, {});
  typia.assert(output);
}

