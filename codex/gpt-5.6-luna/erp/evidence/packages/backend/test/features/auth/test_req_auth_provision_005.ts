import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_provision_005.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-account-002-user-account-refusal Refuses login when credentials, account status, or active membership are invalid.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-002-user-account-refusal Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.auth.req_auth_provision_005.execute.req_auth_provision_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_provision_005.execute.req_auth_provision_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-005-refuse-ineligible-authentication Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-005-refuse-ineligible-authentication Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_provision_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_provision_005.execute.req_auth_provision_005(connection, {
    password: "incorrect-password",
  });
  typia.assert(output);
  if (output.status !== "refused")
    throw new Error("Invalid authentication credentials were accepted.");
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
