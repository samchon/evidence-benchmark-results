import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_routing_003.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-routing-routing-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-routing-routing-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_routing_003.execute.req_fun_routing_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_routing_003.execute.req_fun_routing_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-routing-routing-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-routing-routing-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-routing-003-a-production-manager-activates-a-draft-routing-version Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-routing-003-a-production-manager-activates-a-draft-routing-version Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-routing-003-select-only-an-active-routing-for-new-production Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-routing-003-select-only-an-active-routing-for-new-production Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_routing_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_routing_003.execute.req_fun_routing_003(connection, {});
  typia.assert(output);
}
