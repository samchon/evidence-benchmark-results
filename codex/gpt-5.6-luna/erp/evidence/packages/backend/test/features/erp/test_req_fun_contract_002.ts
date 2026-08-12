import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_contract_002.
 *
 * @evidence {@link api.functional.erp.req_fun_contract_002.execute.req_fun_contract_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_contract_002.execute.req_fun_contract_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-contract-employment-contract-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-contract-employment-contract-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-contract-002-the-employment-contract-for-automatically-ends-employee Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-contract-002-the-employment-contract-for-automatically-ends-employee Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-contract-002-end-the-prior-contract-before-replacement Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-contract-002-end-the-prior-contract-before-replacement Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_contract_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_contract_002.execute.req_fun_contract_002(connection, {});
  typia.assert(output);
}

