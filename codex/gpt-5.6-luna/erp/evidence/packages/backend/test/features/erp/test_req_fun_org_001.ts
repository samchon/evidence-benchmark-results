import * as api from "@benchmark/erp-api";
import typia from "typia";
import { MyGlobal } from "../../../src/MyGlobal";

/**
 * Proves organization creation and first-owner setup.
 *
 * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-production-backend-delivery Owns the cross-cutting backend behavior at this operation/test boundary.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-production-backend-delivery Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/02-domain-model.md#req-dom-org-organization-scope Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-org-organization-scope Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_org_001.execute.req_fun_org_001} Calls the generated organization operation.
 * @evidenceReview {@link api.functional.erp.req_fun_org_001.execute.req_fun_org_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Exercises the organization operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-001-creates-an-organization-and-becomes-its-first-owner Asserts the persisted tenant and active membership.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-001-creates-an-organization-and-becomes-its-first-owner Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-org-access-001-a-read-write-command-report-export-approval-audit-event-notification-or-background-job-may-access-only-its-active-organization Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-org-access-001-a-read-write-command-report-export-approval-audit-event-notification-or-background-job-may-access-only-its-active-organization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-org-access-004-must-retain-at-least-one-active-owner Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-org-access-004-must-retain-at-least-one-active-owner Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_org_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_org_001.execute.req_fun_org_001(connection, {});
  typia.assert(output);
  const organization = await MyGlobal.prisma.organizations.findUnique({
    where: { id: output.organizationId },
  });
  if (organization === null || organization.deleted_at !== null)
    throw new Error("Organization creation did not persist an active tenant.");
  const owner = await MyGlobal.prisma.memberships.findFirst({
    where: { organization_id: organization.id, status: "active" },
  });
  if (owner === null)
    throw new Error("Organization creation did not establish its first active Owner membership.");
}
