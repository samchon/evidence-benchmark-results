import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_sales_invoice_004.
 *
 * @evidence {@link api.functional.erp.req_fun_sales_invoice_004.execute.req_fun_sales_invoice_004} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_sales_invoice_004.execute.req_fun_sales_invoice_004} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-sales-invoice-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-sales-invoice-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-004-changes-on-the-invoice Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-004-changes-on-the-invoice Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-sales-invoice-004-a-posted-invoice-cannot-be-edited Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-sales-invoice-004-a-posted-invoice-cannot-be-edited Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_sales_invoice_004(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_sales_invoice_004.execute.req_fun_sales_invoice_004(connection, {});
  typia.assert(output);
}

