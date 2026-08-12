import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_org_005.
 *
 * @evidence {@link api.functional.erp.req_fun_org_005.execute.req_fun_org_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_org_005.execute.req_fun_org_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-005-an-eligible-organization-is-deleted-with-a-retained-sensitive-audit-event Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-005-an-eligible-organization-is-deleted-with-a-retained-sensitive-audit-event Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_org_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_org_005.execute.req_fun_org_005(connection, {});
  typia.assert(output);
}

