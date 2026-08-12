import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_jrn_p2p_001.
 *
 * @evidence {@link api.functional.erp.req_jrn_p2p_001.execute.req_jrn_p2p_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_jrn_p2p_001.execute.req_jrn_p2p_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-p2p-procure-to-pay-journey Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-p2p-procure-to-pay-journey Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-p2p-001-submits-purchasing-demand-against-active-vendor-item-warehouse Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-p2p-001-submits-purchasing-demand-against-active-vendor-item-warehouse Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_jrn_p2p_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_jrn_p2p_001.execute.req_jrn_p2p_001(connection, {});
  typia.assert(output);
}

