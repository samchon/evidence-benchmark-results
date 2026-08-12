import * as api from "@benchmark/erp-api";
import typia from "typia";
import { MyGlobal } from "../../../src/MyGlobal";

/**
 * Proves the generated authentication accessor req_auth_account_006.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-account-006-account-reactivation-does-not-restore-a-separately-revoked-organization-membership Reactivates only the global account and leaves membership state independent.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-006-account-reactivation-does-not-restore-a-separately-revoked-organization-membership Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.auth.req_auth_account_006.execute.req_auth_account_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_account_006.execute.req_auth_account_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-006-reactivate-a-deactivated-account Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-006-reactivate-a-deactivated-account Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_account_006(
  connection: api.IConnection,
): Promise<void> {
  const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { email: "owner@example.invalid" } });
  const membership = await MyGlobal.prisma.memberships.findFirstOrThrow({ where: { user_id: user.id } });
  await MyGlobal.prisma.memberships.update({ where: { id: membership.id }, data: { status: "revoked" } });
  const output = await api.functional.auth.req_auth_account_006.execute.req_auth_account_006(connection, {});
  typia.assert(output);
  const after = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: membership.id } });
  const reactivated = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: user.id } });
  if (reactivated.status !== "active" || after.status !== "revoked")
    throw new Error("Account reactivation incorrectly restored organization membership.");
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
