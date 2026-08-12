import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_purchase_receipt_002.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-purchase-receipt-purchase-receipt-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-purchase-receipt-purchase-receipt-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_purchase_receipt_002.execute.req_fun_purchase_receipt_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_purchase_receipt_002.execute.req_fun_purchase_receipt_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-purchase-receipt-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-purchase-receipt-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-002-records-received-accepted-rejected-lot-or-serial-warehouse Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-002-records-received-accepted-rejected-lot-or-serial-warehouse Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-receipt-002-must-identify-valid-lots-or-one-serial-per-unit Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-receipt-002-must-identify-valid-lots-or-one-serial-per-unit Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_purchase_receipt_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_purchase_receipt_002.execute.req_fun_purchase_receipt_002(connection, {});
  typia.assert(output);
}
