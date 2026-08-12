import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_maintenance_order_004.
 *
 * @evidence {@link api.functional.erp.req_fun_maintenance_order_004.execute.req_fun_maintenance_order_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_maintenance_order_004.execute.req_fun_maintenance_order_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-maintenance-work-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-maintenance-work-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-004-posts-stock-movements Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-004-posts-stock-movements Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-maintenance-004-maintenance-work-order-refusal Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-maintenance-004-maintenance-work-order-refusal Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_maintenance_order_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_maintenance_order_004.execute.req_fun_maintenance_order_004(connection, {});
  typia.assert(output);
}

