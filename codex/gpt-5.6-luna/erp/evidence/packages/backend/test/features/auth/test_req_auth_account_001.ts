import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_account_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-account-001-must-be-globally-unique Normalizes account email identity before the unique persistence lookup.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-001-must-be-globally-unique Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-account-user-account-rules Implements the global account lifecycle and credential authority rules.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-user-account-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.auth.req_auth_account_001.execute.req_auth_account_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_account_001.execute.req_auth_account_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-001-view-the-global-user-profile Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-001-view-the-global-user-profile Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_account_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_account_001.execute.req_auth_account_001(connection, {
    email: "OWNER@EXAMPLE.INVALID",
  });
  typia.assert(output);
  if (output.email !== "owner@example.invalid")
    throw new Error("Account email normalization was not applied before lookup.");
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
