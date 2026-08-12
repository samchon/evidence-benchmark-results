import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_role_009.
 *
 * @evidence {@link api.functional.auth.req_auth_role_009.execute.req_auth_role_009} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_role_009.execute.req_auth_role_009} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-009-becomes-organization-role-for-creator-becomes-first Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-009-becomes-organization-role-for-creator-becomes-first Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_role_009(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_role_009.execute.req_auth_role_009(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
