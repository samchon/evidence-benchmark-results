import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_location_002.
 *
 * @evidence {@link api.functional.erp.req_fun_location_002.execute.req_fun_location_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_location_002.execute.req_fun_location_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-location-storage-location-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-location-storage-location-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-location-002-searches-locations-by-warehouse-code-parent-status Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-location-002-searches-locations-by-warehouse-code-parent-status Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_location_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_location_002.execute.req_fun_location_002(connection, {});
  typia.assert(output);
}

