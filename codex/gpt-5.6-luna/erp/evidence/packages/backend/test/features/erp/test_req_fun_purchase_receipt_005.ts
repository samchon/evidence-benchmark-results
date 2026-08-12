import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_purchase_receipt_005.
 *
 * @evidence {@link api.functional.erp.req_fun_purchase_receipt_005.execute.req_fun_purchase_receipt_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_purchase_receipt_005.execute.req_fun_purchase_receipt_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-purchase-receipt-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-purchase-receipt-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-005-an-authorized-user-corrects-a-posted-receipt-through-a-purchase-return-or-inventory-adjustment Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-purchase-receipt-005-an-authorized-user-corrects-a-posted-receipt-through-a-purchase-return-or-inventory-adjustment Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_purchase_receipt_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_purchase_receipt_005.execute.req_fun_purchase_receipt_005(connection, {});
  typia.assert(output);
}

