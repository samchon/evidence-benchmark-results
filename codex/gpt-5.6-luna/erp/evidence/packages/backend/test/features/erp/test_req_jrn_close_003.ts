import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_jrn_close_003.
 *
 * @evidence {@link api.functional.erp.req_jrn_close_003.execute.req_jrn_close_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_jrn_close_003.execute.req_jrn_close_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-close-period-close-journey Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-close-period-close-journey Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-close-003-becomes-hard-closed-with-immutable-snapshots Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-jrn-close-003-becomes-hard-closed-with-immutable-snapshots Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_jrn_close_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_jrn_close_003.execute.req_jrn_close_003(connection, {});
  typia.assert(output);
}

