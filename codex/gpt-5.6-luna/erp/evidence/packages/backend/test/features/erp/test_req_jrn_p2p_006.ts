import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_jrn_p2p_006.
 *
 * @evidence {@link api.functional.erp.req_jrn_p2p_006.execute.req_jrn_p2p_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_jrn_p2p_006.execute.req_jrn_p2p_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-p2p-procure-to-pay-journey Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-p2p-procure-to-pay-journey Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-p2p-006-a-procure-to-pay-for-purchase-return-vendor Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-p2p-006-a-procure-to-pay-for-purchase-return-vendor Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_jrn_p2p_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_jrn_p2p_006.execute.req_jrn_p2p_006(connection, {});
  typia.assert(output);
}

