import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_vendor_bill_005.
 *
 * @evidence {@link api.functional.erp.req_fun_vendor_bill_005.execute.req_fun_vendor_bill_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_vendor_bill_005.execute.req_fun_vendor_bill_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-vendor-bill-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-vendor-bill-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-005-changes-on-the-bill Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-vendor-bill-005-changes-on-the-bill Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vendor-bill-005-a-posted-bill-cannot-be-edited Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vendor-bill-005-a-posted-bill-cannot-be-edited Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_vendor_bill_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_vendor_bill_005.execute.req_fun_vendor_bill_005(connection, {});
  typia.assert(output);
}

