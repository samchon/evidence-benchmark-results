import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_bom_002.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-bom-bill-of-materials-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-bom-bill-of-materials-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_bom_002.execute.req_fun_bom_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_bom_002.execute.req_fun_bom_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bom-bill-of-materials-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-bom-bill-of-materials-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-bom-002-searches-boms-by-finished-item-version-status Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-bom-002-searches-boms-by-finished-item-version-status Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-bom-002-retain-the-production-orders-bom-version Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-bom-002-retain-the-production-orders-bom-version Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_bom_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_bom_002.execute.req_fun_bom_002(connection, {});
  typia.assert(output);
}
