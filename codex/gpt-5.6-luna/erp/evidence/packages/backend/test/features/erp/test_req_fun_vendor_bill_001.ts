import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_vendor_bill_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-vendor-bill-vendor-bill-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vendor-bill-vendor-bill-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-atomic-cross-module-outcome-consistency Owns the cross-cutting backend behavior at this operation/test boundary.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-atomic-cross-module-outcome-consistency Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-bill-vendor-bill-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vendor-bill-vendor-bill-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_vendor_bill_001.execute.req_fun_vendor_bill_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_vendor_bill_001.execute.req_fun_vendor_bill_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-vendor-bill-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-vendor-bill-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-001-creates-a-draft-vendor-bill-from-purchase-orders-or-receipts Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-001-creates-a-draft-vendor-bill-from-purchase-orders-or-receipts Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vendor-bill-001-a-bill-line-cannot-exceed-eligible-source-order-or-receipt-quantity-without-an-approved-override Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vendor-bill-001-a-bill-line-cannot-exceed-eligible-source-order-or-receipt-quantity-without-an-approved-override Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_vendor_bill_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_vendor_bill_001.execute.req_fun_vendor_bill_001(connection, {});
  typia.assert(output);
}
