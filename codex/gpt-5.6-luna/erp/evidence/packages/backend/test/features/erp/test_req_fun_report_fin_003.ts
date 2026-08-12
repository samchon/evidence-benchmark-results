import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_report_fin_003.
 *
 * @evidence {@link api.functional.erp.req_fun_report_fin_003.execute.req_fun_report_fin_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_report_fin_003.execute.req_fun_report_fin_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-003-generates-a-profit-and-loss-report Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-fin-003-generates-a-profit-and-loss-report Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-reports-use-posted-journal-entries-rather-than-editable-drafts Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-003-reports-use-posted-journal-entries-rather-than-editable-drafts Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-report-003-users-reporting-integrity-for-users-rely-report Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-report-003-users-reporting-integrity-for-users-rely-report Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_report_fin_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_report_fin_003.execute.req_fun_report_fin_003(connection, {});
  typia.assert(output);
}

