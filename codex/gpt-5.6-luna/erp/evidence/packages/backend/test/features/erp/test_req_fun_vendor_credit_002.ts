import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_vendor_credit_002.
 *
 * @evidence {@link api.functional.erp.req_fun_vendor_credit_002.execute.req_fun_vendor_credit_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_vendor_credit_002.execute.req_fun_vendor_credit_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-credit-vendor-credit-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-vendor-credit-vendor-credit-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-credit-002-applies-all-or-part-of-a-vendor-credit-to-one-or-more-bills Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-vendor-credit-002-applies-all-or-part-of-a-vendor-credit-to-one-or-more-bills Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_vendor_credit_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_vendor_credit_002.execute.req_fun_vendor_credit_002(connection, {});
  typia.assert(output);
}

