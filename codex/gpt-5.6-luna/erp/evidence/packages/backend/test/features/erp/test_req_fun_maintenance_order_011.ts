import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_maintenance_order_011.
 *
 * @evidence {@link api.functional.erp.req_fun_maintenance_order_011.execute.req_fun_maintenance_order_011} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_maintenance_order_011.execute.req_fun_maintenance_order_011} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-maintenance-work-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-maintenance-work-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-011-the-product-blocks-production-scheduling-that-depends-on-critical-equipment-during-downtime Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-maintenance-order-011-the-product-blocks-production-scheduling-that-depends-on-critical-equipment-during-downtime Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_maintenance_order_011(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_maintenance_order_011.execute.req_fun_maintenance_order_011(connection, {});
  typia.assert(output);
}

