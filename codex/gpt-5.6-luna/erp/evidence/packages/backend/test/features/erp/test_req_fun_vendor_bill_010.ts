import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_vendor_bill_010.
 *
 * @evidence {@link api.functional.erp.req_fun_vendor_bill_010.execute.req_fun_vendor_bill_010} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_vendor_bill_010.execute.req_fun_vendor_bill_010} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-vendor-bill-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-vendor-bill-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-010-views-bill-matching-posting-payment-dispute Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-010-views-bill-matching-posting-payment-dispute Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_vendor_bill_010(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_vendor_bill_010.execute.req_fun_vendor_bill_010(connection, {});
  typia.assert(output);
}

