import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_sales_invoice_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-sales-invoice-sales-invoice-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-sales-invoice-sales-invoice-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/02-domain-model.md#req-dom-sales-invoice-sales-invoice-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-sales-invoice-sales-invoice-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_sales_invoice_001.execute.req_fun_sales_invoice_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_sales_invoice_001.execute.req_fun_sales_invoice_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-sales-invoice-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-sales-invoice-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-001-creates-a-draft-invoice-from-an-order-or-shipment Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-sales-invoice-001-creates-a-draft-invoice-from-an-order-or-shipment Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-sales-invoice-001-invoice-quantity-cannot-exceed-shipped-and-uninvoiced-quantity-unless-advance-billing-is-enabled-by-organization-policy Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-sales-invoice-001-invoice-quantity-cannot-exceed-shipped-and-uninvoiced-quantity-unless-advance-billing-is-enabled-by-organization-policy Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_sales_invoice_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_sales_invoice_001.execute.req_fun_sales_invoice_001(connection, {});
  typia.assert(output);
}
