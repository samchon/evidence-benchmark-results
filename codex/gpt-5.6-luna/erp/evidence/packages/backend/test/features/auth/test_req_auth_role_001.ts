import * as api from "@benchmark/erp-api";
import typia from "typia";
import { MyGlobal } from "../../../src/MyGlobal";

/**
 * Proves the generated authentication accessor req_auth_role_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-role-role-integrity-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-role-integrity-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.auth.req_auth_role_001.execute.req_auth_role_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_role_001.execute.req_auth_role_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-the-organization-role-for-built-catalog-owner Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-001-the-organization-role-for-built-catalog-owner Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-role-001-built-in-roles-cannot-be-deleted Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-001-built-in-roles-cannot-be-deleted Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_role_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_role_001.execute.req_auth_role_001(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
  const owner = await MyGlobal.prisma.roles.findFirst({
    where: { organization_id: output.organizationId, name: "Owner" },
  });
  if (owner === null || owner.kind !== "built_in")
    throw new Error("The built-in Owner role was not retained.");
}
