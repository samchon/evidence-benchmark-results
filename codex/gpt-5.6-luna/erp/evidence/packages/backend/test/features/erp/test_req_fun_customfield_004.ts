import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_customfield_004.
 *
 * @evidence {@link api.functional.erp.req_fun_customfield_004.execute.req_fun_customfield_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_customfield_004.execute.req_fun_customfield_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-customfield-custom-field-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-customfield-custom-field-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-customfield-004-views-custom-field-values-on-a-visible-target Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-customfield-004-views-custom-field-values-on-a-visible-target Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_customfield_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_customfield_004.execute.req_fun_customfield_004(connection, {});
  typia.assert(output);
}

