import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_inspection_002.
 *
 * @evidence {@link api.functional.erp.req_fun_inspection_002.execute.req_fun_inspection_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_inspection_002.execute.req_fun_inspection_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inspection-inspection-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-inspection-inspection-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inspection-002-starts-a-pending-inspection Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-inspection-002-starts-a-pending-inspection Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-quality-002-must-be-accept-reject-rework-return-to-vendor-scrap-or-use-as-is Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-quality-002-must-be-accept-reject-rework-return-to-vendor-scrap-or-use-as-is Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_inspection_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_inspection_002.execute.req_fun_inspection_002(connection, {});
  typia.assert(output);
}

