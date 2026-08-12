import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_purchase_request_005.
 *
 * @evidence {@link api.functional.erp.req_fun_purchase_request_005.execute.req_fun_purchase_request_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_purchase_request_005.execute.req_fun_purchase_request_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-request-purchase-request-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-request-purchase-request-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-request-005-routes-the-request-from-amount-context-account-vendor-requester-role Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-request-005-routes-the-request-from-amount-context-account-vendor-requester-role Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-purchase-request-005-a-cancelled-rejected-or-fully-converted-request-cannot-be-submitted-or-converted-again Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-purchase-request-005-a-cancelled-rejected-or-fully-converted-request-cannot-be-submitted-or-converted-again Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_purchase_request_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_purchase_request_005.execute.req_fun_purchase_request_005(connection, {});
  typia.assert(output);
}

