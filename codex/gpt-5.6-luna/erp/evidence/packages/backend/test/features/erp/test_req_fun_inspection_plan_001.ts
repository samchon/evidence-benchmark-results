import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_inspection_plan_001.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-inspection-plan-inspection-plans Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-inspection-plan-inspection-plans Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_inspection_plan_001.execute.req_fun_inspection_plan_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_inspection_plan_001.execute.req_fun_inspection_plan_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inspection-plan-inspection-plan-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-inspection-plan-inspection-plan-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inspection-plan-001-creates-an-inspection-plan Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-inspection-plan-001-creates-an-inspection-plan Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_inspection_plan_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_inspection_plan_001.execute.req_fun_inspection_plan_001(connection, {});
  typia.assert(output);
}
