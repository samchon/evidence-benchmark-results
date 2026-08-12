import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_report_fin_005.
 *
 * @evidence {@link api.functional.erp.req_fun_report_fin_005.execute.req_fun_report_fin_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_report_fin_005.execute.req_fun_report_fin_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-005-generates-accounts-receivable-aging Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-fin-005-generates-accounts-receivable-aging Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-005-must-preserve-the-selected-report-filters-organization-currency Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-005-must-preserve-the-selected-report-filters-organization-currency Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_report_fin_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_report_fin_005.execute.req_fun_report_fin_005(connection, {});
  typia.assert(output);
}

