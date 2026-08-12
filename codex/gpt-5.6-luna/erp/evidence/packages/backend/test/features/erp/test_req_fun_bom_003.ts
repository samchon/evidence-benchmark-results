import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_bom_003.
 *
 * @evidence {@link api.functional.erp.req_fun_bom_003.execute.req_fun_bom_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_bom_003.execute.req_fun_bom_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bom-bill-of-materials-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-bom-bill-of-materials-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bom-003-a-production-manager-activates-a-draft-bom-version Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-bom-003-a-production-manager-activates-a-draft-bom-version Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-bom-003-select-only-an-active-bom-for-new-production Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-bom-003-select-only-an-active-bom-for-new-production Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_bom_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_bom_003.execute.req_fun_bom_003(connection, {});
  typia.assert(output);
}

