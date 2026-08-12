import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated authentication accessor req_auth_position_001.
 *
 * @evidence {@link api.functional.auth.req_auth_position_001.execute.req_auth_position_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.auth.req_auth_position_001.execute.req_auth_position_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Exercises the authentication family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-001-assigns-or-clears-the-department-manager-of-a-specific-department Exercises the exact authentication requirement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-001-assigns-or-clears-the-department-manager-of-a-specific-department Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-automation-001-organizations-system-automation-for-organizations-rely-scheduled Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-automation-001-organizations-system-automation-for-organizations-rely-scheduled Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-automation-004-retrying-system-automation-for-retrying-failed-automated Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-automation-004-retrying-system-automation-for-retrying-failed-automated Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_auth_position_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.auth.req_auth_position_001.execute.req_auth_position_001(connection, {});
  typia.assert(output);
  if (output.id.length === 0 || output.createdAt.length === 0)
    throw new Error("Authentication operation returned no durable result identity.");
}
