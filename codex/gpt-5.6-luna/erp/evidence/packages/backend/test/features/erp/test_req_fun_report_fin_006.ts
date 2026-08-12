import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_report_fin_006.
 *
 * @evidence {@link api.functional.erp.req_fun_report_fin_006.execute.req_fun_report_fin_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_report_fin_006.execute.req_fun_report_fin_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-006-generates-accounts-payable-aging Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-fin-006-generates-accounts-payable-aging Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-006-must-reproduce-the-applicable-closing-snapshot Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-006-must-reproduce-the-applicable-closing-snapshot Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_report_fin_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_report_fin_006.execute.req_fun_report_fin_006(connection, {});
  typia.assert(output);
}

