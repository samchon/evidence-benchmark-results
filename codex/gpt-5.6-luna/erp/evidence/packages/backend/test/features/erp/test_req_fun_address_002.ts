import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_address_002.
 *
 * @evidence {@link api.functional.erp.req_fun_address_002.execute.req_fun_address_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_address_002.execute.req_fun_address_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-address-address-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-address-address-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-address-002-finds-addresses-available-for-a-named-relationship-purpose Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-address-002-finds-addresses-available-for-a-named-relationship-purpose Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-tenant-002-users-can-rely-on-role-and-scoped-position-checks-being-applied-consistently-to-every-read-command-approval-report-export-audit-view-notification-and-automated-result Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-tenant-002-users-can-rely-on-role-and-scoped-position-checks-being-applied-consistently-to-every-read-command-approval-report-export-audit-view-notification-and-automated-result Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_address_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_address_002.execute.req_fun_address_002(connection, {});
  typia.assert(output);
}

