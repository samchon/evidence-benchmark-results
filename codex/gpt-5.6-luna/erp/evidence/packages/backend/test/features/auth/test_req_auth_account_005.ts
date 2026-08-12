import * as api from "@benchmark/erp-api";
import typia from "typia";
import { MyGlobal } from "../../../src/MyGlobal";

/**
 * Proves the generated authentication accessor req_auth_account_005.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-account-005-revokes-every-session-and-blocks-login Deactivates the account and revokes its active sessions.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-005-revokes-every-session-and-blocks-login Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.auth.req_auth_account_005.execute.req_auth_account_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_account_005.execute.req_auth_account_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-005-deactivate-the-global-user-account Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-005-deactivate-the-global-user-account Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_account_005(
  connection: api.IConnection,
): Promise<void> {
  await api.functional.auth.req_auth_session_001.execute.req_auth_session_001(connection, {});
  const output = await api.functional.auth.req_auth_account_005.execute.req_auth_account_005(connection, {});
  typia.assert(output);
  const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: output.userId! } });
  const active = await MyGlobal.prisma.sessions.count({ where: { user_id: user.id, revoked_at: null } });
  if (user.status !== "inactive" || active !== 0)
    throw new Error("Account deactivation did not block the account and revoke sessions.");
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
