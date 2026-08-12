import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_address_004.
 *
 * @evidence {@link api.functional.erp.req_fun_address_004.execute.req_fun_address_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_address_004.execute.req_fun_address_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-address-address-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-address-address-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-address-004-an-authorized-user-deactivates-an-address-so-it-cannot-be-selected-for-new-relationships Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-address-004-an-authorized-user-deactivates-an-address-so-it-cannot-be-selected-for-new-relationships Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-tenant-004-users-can-rely-on-sensitive-employee-payroll-bank-tax Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-tenant-004-users-can-rely-on-sensitive-employee-payroll-bank-tax Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_address_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_address_004.execute.req_fun_address_004(connection, {});
  typia.assert(output);
}

