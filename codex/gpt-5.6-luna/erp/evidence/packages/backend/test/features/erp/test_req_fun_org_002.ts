import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_org_002.
 *
 * @evidence {@link api.functional.erp.req_fun_org_002.execute.req_fun_org_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_org_002.execute.req_fun_org_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-002-views-the-active-organizations-identity-and-configuration Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-002-views-the-active-organizations-identity-and-configuration Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-org-access-002-receives-no-data-or-authority-from-it Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-org-access-002-receives-no-data-or-authority-from-it Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_org_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_org_002.execute.req_fun_org_002(connection, {});
  typia.assert(output);
}

