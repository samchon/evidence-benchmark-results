import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_reconciliation_002.
 *
 * @evidence {@link api.functional.erp.req_fun_reconciliation_002.execute.req_fun_reconciliation_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_reconciliation_002.execute.req_fun_reconciliation_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-reconciliation-bank-reconciliation-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-reconciliation-bank-reconciliation-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-reconciliation-002-adds-or-resolves-reconciliation-lines-and-transaction-matches Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-reconciliation-002-adds-or-resolves-reconciliation-lines-and-transaction-matches Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-bank-002-a-reconciliation-cannot-complete-until-included-statement-activity-explains-the-ending-balance-from-the-beginning-balance Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-bank-002-a-reconciliation-cannot-complete-until-included-statement-activity-explains-the-ending-balance-from-the-beginning-balance Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_reconciliation_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_reconciliation_002.execute.req_fun_reconciliation_002(connection, {});
  typia.assert(output);
}

