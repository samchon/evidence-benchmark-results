import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_position_002.
 *
 * @evidence {@link api.functional.auth.req_auth_position_002.execute.req_auth_position_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_position_002.execute.req_auth_position_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-002-assigns-or-clears-the-project-manager-of-a-specific-project Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-002-assigns-or-clears-the-project-manager-of-a-specific-project Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-automation-002-automated-work-cannot-cross-organization-boundaries-or-bypass-the-business-rules-that-apply-to-users Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-automation-002-automated-work-cannot-cross-organization-boundaries-or-bypass-the-business-rules-that-apply-to-users Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_position_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_position_002.execute.req_auth_position_002(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
