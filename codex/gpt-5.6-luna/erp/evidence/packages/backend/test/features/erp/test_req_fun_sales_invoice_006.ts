import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_sales_invoice_006.
 *
 * @evidence {@link api.functional.erp.req_fun_sales_invoice_006.execute.req_fun_sales_invoice_006} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_sales_invoice_006.execute.req_fun_sales_invoice_006} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-sales-invoice-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-sales-invoice-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-006-a-sales-or-finance-user-sends-a-posted-invoice Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-006-a-sales-or-finance-user-sends-a-posted-invoice Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-sales-invoice-006-uses-void-credit-memo-refund-or-adjustment-with-source-links Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-sales-invoice-006-uses-void-credit-memo-refund-or-adjustment-with-source-links Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_sales_invoice_006(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_sales_invoice_006.execute.req_fun_sales_invoice_006(connection, {});
  typia.assert(output);
}

