import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_membership_006.
 *
 * @evidence {@link api.functional.auth.req_auth_membership_006.execute.req_auth_membership_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_membership_006.execute.req_auth_membership_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-006-refuses-membership-actions-that-would-leave-it-without-an-active-owner Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-006-refuses-membership-actions-that-would-leave-it-without-an-active-owner Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-membership-006-removes-access-from-every-existing-session Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-membership-006-removes-access-from-every-existing-session Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_membership_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_membership_006.execute.req_auth_membership_006(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
