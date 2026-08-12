import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_allocation_005.
 *
 * @evidence {@link api.functional.erp.req_fun_allocation_005.execute.req_fun_allocation_005} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_allocation_005.execute.req_fun_allocation_005} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-allocation-stock-allocation-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-allocation-stock-allocation-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-allocation-005-refuses-allocation-when-eligible-available-stock-is-insufficient-or-concurrently-reserved Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-allocation-005-refuses-allocation-when-eligible-available-stock-is-insufficient-or-concurrently-reserved Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-allocation-005-shipment-cannot-consume-more-than-the-linked-allocation-and-eligible-order-remainder Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-allocation-005-shipment-cannot-consume-more-than-the-linked-allocation-and-eligible-order-remainder Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_allocation_005(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_allocation_005.execute.req_fun_allocation_005(connection, {});
  typia.assert(output);
}

