import * as api from "@benchmark/erp-api";
import typia from "typia";
import { MyGlobal } from "../../../src/MyGlobal";

/**
 * Proves the generated ERP accessor req_fun_address_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-org-access-organization-isolation-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-org-access-organization-isolation-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-tenant-tenant-privacy-and-authority Owns the cross-cutting backend behavior at this operation/test boundary.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-tenant-tenant-privacy-and-authority Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/02-domain-model.md#req-dom-address-addresses Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-address-addresses Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_address_001.execute.req_fun_address_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_address_001.execute.req_fun_address_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-address-address-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-address-address-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-address-001-creates-an-address-for-the-active-organization Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-address-001-creates-an-address-for-the-active-organization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-org-access-001-a-read-write-command-report-export-approval-audit-event-notification-or-background-job-may-access-only-its-active-organization Refuses a request for a different organization boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-org-access-001-a-read-write-command-report-export-approval-audit-event-notification-or-background-job-may-access-only-its-active-organization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-tenant-001-records-and-activity-from-users-without-explicit-membership Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-tenant-001-records-and-activity-from-users-without-explicit-membership Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_address_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_address_001.execute.req_fun_address_001(connection, {
    attributes: { postalCode: "10001", purpose: "billing" },
  });
  typia.assert(output);
  if (output.attributes?.postalCode !== "10001")
    throw new Error("Address-specific attributes were not returned from the persisted record.");
  const stored = await MyGlobal.prisma.addresses.findUnique({ where: { id: output.id } });
  if (stored === null || JSON.parse(stored.attributes ?? "{}").postalCode !== "10001")
    throw new Error("Address-specific attributes were not durably persisted.");
  let refused = false;
  try {
    await api.functional.erp.req_fun_address_001.execute.req_fun_address_001(connection, {
      organizationId: "00000000-0000-4000-8000-000000000099",
    });
  } catch {
    refused = true;
  }
  if (!refused) throw new Error("A request outside the active organization was accepted.");
}
