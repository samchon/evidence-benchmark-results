import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_account_003.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-account-003-password-change-requires-the-current-password Checks the current password before replacing the stored credential.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-003-password-change-requires-the-current-password Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.auth.req_auth_account_003.execute.req_auth_account_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_account_003.execute.req_auth_account_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-003-change-the-password-while-signed-in Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-003-change-the-password-while-signed-in Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_account_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_account_003.execute.req_auth_account_003(connection, {
    currentPassword: "default-password",
    password: "changed-password",
  });
  typia.assert(output);
  let refused = false;
  try {
    await api.functional.auth.req_auth_account_003.execute.req_auth_account_003(connection, {
      currentPassword: "wrong-password",
      password: "should-not-apply",
    });
  } catch {
    refused = true;
  }
  if (!refused) throw new Error("Password change accepted an incorrect current password.");
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
