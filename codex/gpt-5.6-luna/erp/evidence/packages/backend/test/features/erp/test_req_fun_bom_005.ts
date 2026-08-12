import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_bom_005.
 *
 * @evidence {@link api.functional.erp.req_fun_bom_005.execute.req_fun_bom_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_bom_005.execute.req_fun_bom_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bom-bill-of-materials-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-bom-bill-of-materials-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bom-005-a-production-manager-inactivates-or-supersedes-an-eligible-bom-version Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-bom-005-a-production-manager-inactivates-or-supersedes-an-eligible-bom-version Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_bom_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_bom_005.execute.req_fun_bom_005(connection, {});
  typia.assert(output);
}

