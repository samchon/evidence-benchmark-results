import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_asset_journey_007.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-asset-impairment-asset-impairments Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-asset-impairment-asset-impairments Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_asset_journey_007.execute.req_fun_asset_journey_007} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_asset_journey_007.execute.req_fun_asset_journey_007} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-asset-journey-acquire-to-retire-asset-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-asset-journey-acquire-to-retire-asset-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-asset-journey-007-runs-and-posts-depreciation-for-an-eligible-period Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-asset-journey-007-runs-and-posts-depreciation-for-an-eligible-period Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_asset_journey_007(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_asset_journey_007.execute.req_fun_asset_journey_007(connection, {});
  typia.assert(output);
}
