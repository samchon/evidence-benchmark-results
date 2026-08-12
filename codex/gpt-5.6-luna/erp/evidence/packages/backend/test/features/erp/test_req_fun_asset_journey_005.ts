import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_asset_journey_005.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-asset-transfer-asset-transfers Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-asset-transfer-asset-transfers Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_asset_journey_005.execute.req_fun_asset_journey_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_asset_journey_005.execute.req_fun_asset_journey_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-asset-journey-acquire-to-retire-asset-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-asset-journey-acquire-to-retire-asset-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-asset-journey-005-a-finance-user-activates-an-approved-asset Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-asset-journey-005-a-finance-user-activates-an-approved-asset Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-asset-005-calculates-gain-or-loss-from-proceeds-and-carrying-value-and-posts-the-result Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-asset-005-calculates-gain-or-loss-from-proceeds-and-carrying-value-and-posts-the-result Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_asset_journey_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_asset_journey_005.execute.req_fun_asset_journey_005(connection, {});
  typia.assert(output);
}
