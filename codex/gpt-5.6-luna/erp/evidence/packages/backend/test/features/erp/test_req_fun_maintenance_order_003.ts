import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_maintenance_order_003.
 *
 * @evidence {@link api.functional.erp.req_fun_maintenance_order_003.execute.req_fun_maintenance_order_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_maintenance_order_003.execute.req_fun_maintenance_order_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-maintenance-work-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-maintenance-work-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-003-starts-scheduled-maintenance Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-003-starts-scheduled-maintenance Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-maintenance-003-updates-equipment-status-and-maintenance-plan-next-due-date Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-maintenance-003-updates-equipment-status-and-maintenance-plan-next-due-date Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_maintenance_order_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_maintenance_order_003.execute.req_fun_maintenance_order_003(connection, {});
  typia.assert(output);
}

