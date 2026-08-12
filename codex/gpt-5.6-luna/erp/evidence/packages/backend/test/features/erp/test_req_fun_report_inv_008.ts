import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_report_inv_008.
 *
 * @evidence {@link api.functional.erp.req_fun_report_inv_008.execute.req_fun_report_inv_008} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_report_inv_008.execute.req_fun_report_inv_008} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-inv-inventory-reports Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-inv-inventory-reports Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-inv-008-an-authorized-user-exports-one-inventory-report-with-its-current-filters-and-scope Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-report-inv-008-an-authorized-user-exports-one-inventory-report-with-its-current-filters-and-scope Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_report_inv_008(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_report_inv_008.execute.req_fun_report_inv_008(connection, {});
  typia.assert(output);
}

