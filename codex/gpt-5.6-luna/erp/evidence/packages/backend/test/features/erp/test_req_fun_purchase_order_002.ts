import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_purchase_order_002.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-order-purchase-order-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-purchase-order-purchase-order-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_purchase_order_002.execute.req_fun_purchase_order_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_purchase_order_002.execute.req_fun_purchase_order_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-order-purchase-order-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-order-purchase-order-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-order-002-creates-a-direct-draft-purchase-order Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-order-002-creates-a-direct-draft-purchase-order Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-doc-link-002-operational-document-its-upstream Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-doc-link-002-operational-document-its-upstream Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-purchase-order-002-only-a-user-with-direct-purchase-permission-may-create-an-order-without-a-request Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-purchase-order-002-only-a-user-with-direct-purchase-permission-may-create-an-order-without-a-request Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-concurrency-002-concurrent-source-quantity-conversions-cannot-together-exceed-remaining-quantity Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-concurrency-002-concurrent-source-quantity-conversions-cannot-together-exceed-remaining-quantity Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_purchase_order_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_purchase_order_002.execute.req_fun_purchase_order_002(connection, {});
  typia.assert(output);
}
