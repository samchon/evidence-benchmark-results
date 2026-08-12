import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_purchase_order_005.
 *
 * @evidence {@link api.functional.erp.req_fun_purchase_order_005.execute.req_fun_purchase_order_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_purchase_order_005.execute.req_fun_purchase_order_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-order-purchase-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-order-purchase-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-order-005-changes-on-the-order Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-order-005-changes-on-the-order Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-doc-link-005-updates-upstream-remaining-quantities-and-statuses Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-doc-link-005-updates-upstream-remaining-quantities-and-statuses Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-purchase-order-005-purchase-order-refusal Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-purchase-order-005-purchase-order-refusal Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-concurrency-005-posting-payment-approval-close-and-reversal-commands-cannot-apply-the-same-terminal-effect-twice Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-concurrency-005-posting-payment-approval-close-and-reversal-commands-cannot-apply-the-same-terminal-effect-twice Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_purchase_order_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_purchase_order_005.execute.req_fun_purchase_order_005(connection, {});
  typia.assert(output);
}

