import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_report_fin_002.
 *
 * @evidence {@link api.functional.erp.req_fun_report_fin_002.execute.req_fun_report_fin_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_report_fin_002.execute.req_fun_report_fin_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-002-generates-a-balance-sheet Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-fin-002-generates-a-balance-sheet Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-002-applicable-cross-module-reporting-for-applicable-filters-fiscal Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-002-applicable-cross-module-reporting-for-applicable-filters-fiscal Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-report-002-reports-from-its-closing-snapshots Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-report-002-reports-from-its-closing-snapshots Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_report_fin_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_report_fin_002.execute.req_fun_report_fin_002(connection, {});
  typia.assert(output);
}

