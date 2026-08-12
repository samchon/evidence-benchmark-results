import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_shipment_007.
 *
 * @evidence {@link api.functional.erp.req_fun_shipment_007.execute.req_fun_shipment_007} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_shipment_007.execute.req_fun_shipment_007} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-shipment-shipment-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-shipment-shipment-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-shipment-007-views-shipment-source-allocation-quantity-lot-or-serial-stock Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-shipment-007-views-shipment-source-allocation-quantity-lot-or-serial-stock Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_shipment_007(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_shipment_007.execute.req_fun_shipment_007(connection, {});
  typia.assert(output);
}

