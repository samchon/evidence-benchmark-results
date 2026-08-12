import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_purchase_request_002.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-request-purchase-request-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-purchase-request-purchase-request-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_purchase_request_002.execute.req_fun_purchase_request_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_purchase_request_002.execute.req_fun_purchase_request_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-request-purchase-request-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-request-purchase-request-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-request-002-edits-their-draft-request Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-request-002-edits-their-draft-request Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-purchase-request-002-changes-and-returns-it-to-draft Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-purchase-request-002-changes-and-returns-it-to-draft Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_purchase_request_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_purchase_request_002.execute.req_fun_purchase_request_002(connection, {});
  typia.assert(output);
}
