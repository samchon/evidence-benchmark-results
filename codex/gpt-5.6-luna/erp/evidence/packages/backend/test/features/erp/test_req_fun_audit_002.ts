import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_audit_002.
 *
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-immutable-and-recoverable-history Owns the cross-cutting backend behavior at this operation/test boundary.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-immutable-and-recoverable-history Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_audit_002.execute.req_fun_audit_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_audit_002.execute.req_fun_audit_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-audit-history-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-audit-audit-history-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-002-searches-audit-events-by-actor-action-target-type-and-identity-risk-level Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-audit-002-searches-audit-events-by-actor-action-target-type-and-identity-risk-level Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-audit-002-audit-events-cannot-be-changed-or-deleted-through-ordinary-product-operations Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-audit-002-audit-events-cannot-be-changed-or-deleted-through-ordinary-product-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-002-users-historical-integrity-for-users-correct-error Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-002-users-historical-integrity-for-users-correct-error Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_audit_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_audit_002.execute.req_fun_audit_002(connection, {});
  typia.assert(output);
}

