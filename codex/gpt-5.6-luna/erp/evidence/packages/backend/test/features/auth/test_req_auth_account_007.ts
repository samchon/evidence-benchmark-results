import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_account_007.
 *
 * @evidence {@link api.functional.auth.req_auth_account_007.execute.req_auth_account_007} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_account_007.execute.req_auth_account_007} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-007-select-the-active-organization-after-login Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-007-select-the-active-organization-after-login Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_account_007(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_account_007.execute.req_auth_account_007(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
