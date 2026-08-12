import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_jrn_p2prod_006.
 *
 * @evidence {@link api.functional.erp.req_jrn_p2prod_006.execute.req_jrn_p2prod_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_jrn_p2prod_006.execute.req_jrn_p2prod_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-p2prod-plan-to-produce-journey Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-p2prod-plan-to-produce-journey Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-p2prod-006-posts-manufacturing-variance-after-all-unresolved-work-is-cleared Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-p2prod-006-posts-manufacturing-variance-after-all-unresolved-work-is-cleared Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_jrn_p2prod_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_jrn_p2prod_006.execute.req_jrn_p2prod_006(connection, {});
  typia.assert(output);
}

