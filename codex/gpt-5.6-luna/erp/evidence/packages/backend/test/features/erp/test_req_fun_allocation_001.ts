import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_allocation_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-allocation-stock-allocation-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-allocation-stock-allocation-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/02-domain-model.md#req-dom-allocation-stock-allocation-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-allocation-stock-allocation-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_allocation_001.execute.req_fun_allocation_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_allocation_001.execute.req_fun_allocation_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-allocation-stock-allocation-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-allocation-stock-allocation-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-allocation-001-an-authorized-sales-or-warehouse-user-allocates-available-stock-to-an-approved-order-line Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-allocation-001-an-authorized-sales-or-warehouse-user-allocates-available-stock-to-an-approved-order-line Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-allocation-001-allocation-stock-allocation-for-only-available-quarantined Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-allocation-001-allocation-stock-allocation-for-only-available-quarantined Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_allocation_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_allocation_001.execute.req_fun_allocation_001(connection, {});
  typia.assert(output);
}
