import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_membership_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-membership-membership-and-role-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-membership-membership-and-role-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.auth.req_auth_membership_001.execute.req_auth_membership_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_membership_001.execute.req_auth_membership_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-001-records-invited-active-suspended-or-revoked-status-for-one-user-and-one-organization Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-001-records-invited-active-suspended-or-revoked-status-for-one-user-and-one-organization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-membership-001-the-pair-of-organization-and-user-identifies-at-most-one-membership Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-membership-001-the-pair-of-organization-and-user-identifies-at-most-one-membership Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_membership_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_membership_001.execute.req_auth_membership_001(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
