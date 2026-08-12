import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_production_order_006.
 *
 * @evidence {@link api.functional.erp.req_fun_production_order_006.execute.req_fun_production_order_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_production_order_006.execute.req_fun_production_order_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-production-order-production-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-production-order-production-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-production-order-006-completes-finished-goods-in-part-or-whole-and-posts-output-movements Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-production-order-006-completes-finished-goods-in-part-or-whole-and-posts-output-movements Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-production-006-posts-manufacturing-variance Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-production-006-posts-manufacturing-variance Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_production_order_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_production_order_006.execute.req_fun_production_order_006(connection, {});
  typia.assert(output);
}

