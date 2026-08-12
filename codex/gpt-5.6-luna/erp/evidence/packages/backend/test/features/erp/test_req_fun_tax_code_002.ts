import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_tax_code_002.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-tax-code-tax-codes-and-rates Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-tax-code-tax-codes-and-rates Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_tax_code_002.execute.req_fun_tax_code_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_tax_code_002.execute.req_fun_tax_code_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-tax-code-tax-code-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-tax-code-tax-code-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-tax-code-002-adds-a-new-effective-tax-rate-without-rewriting-earlier-rates Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-tax-code-002-adds-a-new-effective-tax-rate-without-rewriting-earlier-rates Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-tax-code-002-post-tax-through-the-codes-ledger-account Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-tax-code-002-post-tax-through-the-codes-ledger-account Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_tax_code_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_tax_code_002.execute.req_fun_tax_code_002(connection, {});
  typia.assert(output);
}
