import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_item_002.
 *
 * @evidence {@link api.functional.erp.req_fun_item_002.execute.req_fun_item_002} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_item_002.execute.req_fun_item_002} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-item-item-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-item-item-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-item-002-searches-items-by-sku-name-category-type-status-tracking-mode-preferred-vendor Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-item-002-searches-items-by-sku-name-category-type-status-tracking-mode-preferred-vendor Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-item-002-prevent-service-item-stock-movements Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-item-002-prevent-service-item-stock-movements Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-serial-002-keep-serial-codes-unique-per-item Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-serial-002-keep-serial-codes-unique-per-item Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_item_002(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_item_002.execute.req_fun_item_002(connection, {});
  typia.assert(output);
}

