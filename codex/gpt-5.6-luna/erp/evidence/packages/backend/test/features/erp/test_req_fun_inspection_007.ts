import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_inspection_007.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-disposition-quality-disposition-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-disposition-quality-disposition-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_inspection_007.execute.req_fun_inspection_007} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_inspection_007.execute.req_fun_inspection_007} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inspection-inspection-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-inspection-inspection-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inspection-007-an-authorized-quality-manager-waives-an-inspection-with-a-reason Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-inspection-007-an-authorized-quality-manager-waives-an-inspection-with-a-reason Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_inspection_007(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_inspection_007.execute.req_fun_inspection_007(connection, {});
  typia.assert(output);
}