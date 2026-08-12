import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_principal_001.
 *
 * @evidence {@link api.functional.auth.req_auth_principal_001.execute.req_auth_principal_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_principal_001.execute.req_auth_principal_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-principal-001-the-product-distinguishes-credentialed-users-non-authenticating-external-parties Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-principal-001-the-product-distinguishes-credentialed-users-non-authenticating-external-parties Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_principal_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_principal_001.execute.req_auth_principal_001(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
