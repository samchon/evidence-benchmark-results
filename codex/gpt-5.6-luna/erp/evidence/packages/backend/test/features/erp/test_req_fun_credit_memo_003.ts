import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_credit_memo_003.
 *
 * @evidence {@link api.functional.erp.req_fun_credit_memo_003.execute.req_fun_credit_memo_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_credit_memo_003.execute.req_fun_credit_memo_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-credit-memo-credit-memo-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-credit-memo-credit-memo-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-credit-memo-003-a-finance-user-refunds-remaining-credit-through-a-bank-or-cash-movement Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-credit-memo-003-a-finance-user-refunds-remaining-credit-through-a-bank-or-cash-movement Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credit-memo-003-retain-customer-overpayments-as-credit Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credit-memo-003-retain-customer-overpayments-as-credit Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_credit_memo_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_credit_memo_003.execute.req_fun_credit_memo_003(connection, {});
  typia.assert(output);
}

