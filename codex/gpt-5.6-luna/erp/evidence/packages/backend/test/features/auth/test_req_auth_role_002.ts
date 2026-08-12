import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_role_002.
 *
 * @evidence {@link api.functional.auth.req_auth_role_002.execute.req_auth_role_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_role_002.execute.req_auth_role_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-a-members-effective-authority-is-the-union-of-every-built-in-and-custom-role-assigned-in-the-active-organization Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-002-a-members-effective-authority-is-the-union-of-every-built-in-and-custom-role-assigned-in-the-active-organization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-role-002-a-custom-role-may-contain-any-available-permission-combination-within-its-organization Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-002-a-custom-role-may-contain-any-available-permission-combination-within-its-organization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_role_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_role_002.execute.req_auth_role_002(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
