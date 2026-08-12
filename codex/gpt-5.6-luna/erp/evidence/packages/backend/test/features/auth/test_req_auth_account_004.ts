import * as api from "@benchmark/erp-api";
import typia from "typia";
import { MyGlobal } from "../../../src/MyGlobal";

/**
 * Proves the generated authentication accessor req_auth_account_004.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-account-004-revokes-all-previously-active-sessions Revokes every active session during account recovery.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-004-revokes-all-previously-active-sessions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.auth.req_auth_account_004.execute.req_auth_account_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_account_004.execute.req_auth_account_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-004-recover-account-access-by-email Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-004-recover-account-access-by-email Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_account_004(
  connection: api.IConnection,
): Promise<void> {
  await api.functional.auth.req_auth_session_001.execute.req_auth_session_001(connection, {});
  const output = await api.functional.auth.req_auth_account_004.execute.req_auth_account_004(connection, {});
  typia.assert(output);
  const active = await MyGlobal.prisma.sessions.count({ where: { revoked_at: null } });
  if (active !== 0) throw new Error("Account recovery left an active session behind.");
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
