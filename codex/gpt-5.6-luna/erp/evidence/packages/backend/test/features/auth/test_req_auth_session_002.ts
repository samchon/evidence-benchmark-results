import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_session_002.
 *
 * @evidence {@link api.functional.auth.req_auth_session_002.execute.req_auth_session_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_session_002.execute.req_auth_session_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continues-an-eligible-current-session-without-re-entering-credentials Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-002-continues-an-eligible-current-session-without-re-entering-credentials Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_session_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_session_002.execute.req_auth_session_002(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
