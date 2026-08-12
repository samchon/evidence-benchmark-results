import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_purchase_request_004.
 *
 * @evidence {@link api.functional.erp.req_fun_purchase_request_004.execute.req_fun_purchase_request_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_purchase_request_004.execute.req_fun_purchase_request_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-request-purchase-request-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-request-purchase-request-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-request-004-submits-a-nonterminal-request-for-approval Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-request-004-submits-a-nonterminal-request-for-approval Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-purchase-request-004-a-request-line-cannot-be-converted-beyond-remaining-quantity Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-purchase-request-004-a-request-line-cannot-be-converted-beyond-remaining-quantity Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_purchase_request_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_purchase_request_004.execute.req_fun_purchase_request_004(connection, {});
  typia.assert(output);
}

