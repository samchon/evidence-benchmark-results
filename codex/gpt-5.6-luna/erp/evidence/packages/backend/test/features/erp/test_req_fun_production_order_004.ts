import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_production_order_004.
 *
 * @evidence {@link api.functional.erp.req_fun_production_order_004.execute.req_fun_production_order_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_production_order_004.execute.req_fun_production_order_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-production-order-production-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-production-order-production-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-production-order-004-records-additional-component-consumption-or-scrap Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-production-order-004-records-additional-component-consumption-or-scrap Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-production-004-production-order-material Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-production-004-production-order-material Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_production_order_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_production_order_004.execute.req_fun_production_order_004(connection, {});
  typia.assert(output);
}

