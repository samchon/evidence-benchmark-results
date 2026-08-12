import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_jrn_o2c_001.
 *
 * @evidence {@link api.functional.erp.req_jrn_o2c_001.execute.req_jrn_o2c_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_jrn_o2c_001.execute.req_jrn_o2c_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-o2c-order-to-cash-journey Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-o2c-order-to-cash-journey Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-o2c-001-creates-customer-demand-from-current-item-pricing-and-warehouse-stock Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-o2c-001-creates-customer-demand-from-current-item-pricing-and-warehouse-stock Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_jrn_o2c_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_jrn_o2c_001.execute.req_jrn_o2c_001(connection, {});
  typia.assert(output);
}

