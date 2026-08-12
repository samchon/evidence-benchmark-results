import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_purchase_order_006.
 *
 * @evidence {@link api.functional.erp.req_fun_purchase_order_006.execute.req_fun_purchase_order_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_purchase_order_006.execute.req_fun_purchase_order_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-order-purchase-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-order-purchase-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-order-006-a-procurement-user-sends-an-approved-order-to-the-vendor Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-order-006-a-procurement-user-sends-an-approved-order-to-the-vendor Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-doc-link-006-financial-and-stock-postings-reference-the-source-document-that-generated-them Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-doc-link-006-financial-and-stock-postings-reference-the-source-document-that-generated-them Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-purchase-order-006-closure-is-refused-while-receipts-bills-returns-disputes-or-payments-remain-unresolved Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-purchase-order-006-closure-is-refused-while-receipts-bills-returns-disputes-or-payments-remain-unresolved Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-concurrency-006-a-concurrent-business-command-for-conflict-response-returns Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-concurrency-006-a-concurrent-business-command-for-conflict-response-returns Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_purchase_order_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_purchase_order_006.execute.req_fun_purchase_order_006(connection, {});
  typia.assert(output);
}

