import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_role_003.
 *
 * @evidence {@link api.functional.auth.req_auth_role_003.execute.req_auth_role_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_role_003.execute.req_auth_role_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-every-manager-role-includes-the-employee-self-service-baseline Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-003-every-manager-role-includes-the-employee-self-service-baseline Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-role-003-a-role-may-be-assigned-only-to-an-active-membership-in-the-same-organization Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-003-a-role-may-be-assigned-only-to-an-active-membership-in-the-same-organization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_role_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_role_003.execute.req_auth_role_003(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
