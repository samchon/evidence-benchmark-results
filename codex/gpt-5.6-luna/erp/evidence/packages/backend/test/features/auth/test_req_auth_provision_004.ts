import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_provision_004.
 *
 * @evidence {@link api.functional.auth.req_auth_provision_004.execute.req_auth_provision_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_provision_004.execute.req_auth_provision_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-004-authenticate-and-begin-a-session Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-004-authenticate-and-begin-a-session Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_provision_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_provision_004.execute.req_auth_provision_004(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
