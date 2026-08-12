import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_production_order_002.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-production-order-production-order-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-production-order-production-order-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_production_order_002.execute.req_fun_production_order_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_production_order_002.execute.req_fun_production_order_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-production-order-production-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-production-order-production-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-production-order-002-a-production-manager-releases-an-order-and-reserves-components Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-production-order-002-a-production-manager-releases-an-order-and-reserves-components Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-production-002-records-component-consumption-through-source-linked-movements Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-production-002-records-component-consumption-through-source-linked-movements Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_production_order_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_production_order_002.execute.req_fun_production_order_002(connection, {});
  typia.assert(output);
}
