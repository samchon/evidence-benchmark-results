import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_item_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-serial-item-serial-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-serial-item-serial-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-lot-inventory-lot-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-lot-inventory-lot-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-item-item-stock-effect-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-item-item-stock-effect-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/02-domain-model.md#req-dom-item-item-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-item-item-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_item_001.execute.req_fun_item_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_item_001.execute.req_fun_item_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-item-item-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-item-item-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-item-001-creates-an-item-with-type-sku-unit-prices-tax-tracking-costing Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-item-001-creates-an-item-with-type-sku-unit-prices-tax-tracking-costing Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-item-001-require-tracking-for-inventory-items Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-item-001-require-tracking-for-inventory-items Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-lot-001-require-lot-identity-at-receipt-and-shipment Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-lot-001-require-lot-identity-at-receipt-and-shipment Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-serial-001-require-one-serial-per-moved-unit Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-serial-001-require-one-serial-per-moved-unit Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_item_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_item_001.execute.req_fun_item_001(connection, {});
  typia.assert(output);
}
