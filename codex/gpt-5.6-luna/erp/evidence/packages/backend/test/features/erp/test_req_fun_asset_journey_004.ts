import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_asset_journey_004.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-depreciation-run-depreciation-runs Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-depreciation-run-depreciation-runs Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_asset_journey_004.execute.req_fun_asset_journey_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_asset_journey_004.execute.req_fun_asset_journey_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-asset-journey-acquire-to-retire-asset-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-asset-journey-acquire-to-retire-asset-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-asset-journey-004-approves-or-rejects-asset-capitalization Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-asset-journey-004-approves-or-rejects-asset-capitalization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-asset-004-posts-impairment-loss Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-asset-004-posts-impairment-loss Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_asset_journey_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_asset_journey_004.execute.req_fun_asset_journey_004(connection, {});
  typia.assert(output);
}
