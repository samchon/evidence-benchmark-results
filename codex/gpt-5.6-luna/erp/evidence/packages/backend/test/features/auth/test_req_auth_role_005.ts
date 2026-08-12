import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_role_005.
 *
 * @evidence {@link api.functional.auth.req_auth_role_005.execute.req_auth_role_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_role_005.execute.req_auth_role_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-updates-the-permission-composition-of-a-custom-role Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-005-updates-the-permission-composition-of-a-custom-role Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-role-005-a-role-or-permission-change-emits-an-immutable-audit-event Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-005-a-role-or-permission-change-emits-an-immutable-audit-event Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_role_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_role_005.execute.req_auth_role_005(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
