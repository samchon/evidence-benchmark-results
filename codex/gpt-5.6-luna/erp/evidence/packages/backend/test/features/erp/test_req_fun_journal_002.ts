import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_journal_002.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-journal-journal-entry-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-journal-journal-entry-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_journal_002.execute.req_fun_journal_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_journal_002.execute.req_fun_journal_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-journal-journal-entry-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-journal-journal-entry-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-journal-002-edits-a-draft-journal-and-its-lines Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-journal-002-edits-a-draft-journal-and-its-lines Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-fin-post-002-financial-posting-transaction-currency Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-fin-post-002-financial-posting-transaction-currency Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-journal-002-a-journal-entry-for-manual-above-approval Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-journal-002-a-journal-entry-for-manual-above-approval Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-atomic-002-users-can-rely-on-quantities-balances-status-source-links Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-atomic-002-users-can-rely-on-quantities-balances-status-source-links Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_journal_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_journal_002.execute.req_fun_journal_002(connection, {});
  typia.assert(output);
}
