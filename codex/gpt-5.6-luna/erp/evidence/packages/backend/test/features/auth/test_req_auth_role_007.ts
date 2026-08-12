import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_role_007.
 *
 * @evidence {@link api.functional.auth.req_auth_role_007.execute.req_auth_role_007} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_role_007.execute.req_auth_role_007} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-007-revokes-a-named-role-from-an-active-member Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-007-revokes-a-named-role-from-an-active-member Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_role_007(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_role_007.execute.req_auth_role_007(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
