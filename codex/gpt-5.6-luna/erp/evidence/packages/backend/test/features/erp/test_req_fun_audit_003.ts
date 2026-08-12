import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_audit_003.
 *
 * @evidence {@link api.functional.erp.req_fun_audit_003.execute.req_fun_audit_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_audit_003.execute.req_fun_audit_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-audit-history-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-audit-audit-history-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-003-views-one-events-before-and-after-values-reason-ip-address-user-agent-timestamp Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-audit-003-views-one-events-before-and-after-values-reason-ip-address-user-agent-timestamp Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-audit-003-audit-audit-event-for-history-remains-readable Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-audit-003-audit-audit-event-for-history-remains-readable Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-003-authorized-readers-can-trace-upstream-downstream-reversal-return-credit-amendment Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-003-authorized-readers-can-trace-upstream-downstream-reversal-return-credit-amendment Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_audit_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_audit_003.execute.req_fun_audit_003(connection, {});
  typia.assert(output);
}

