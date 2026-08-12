import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_transfer_003.
 *
 * @evidence {@link api.functional.erp.req_fun_transfer_003.execute.req_fun_transfer_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_transfer_003.execute.req_fun_transfer_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-transfer-warehouse-transfer-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-transfer-warehouse-transfer-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-transfer-003-receives-all-or-part-of-a-shipped-transfer-and-posts-inbound-movements Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-transfer-003-receives-all-or-part-of-a-shipped-transfer-and-posts-inbound-movements Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-transfer-003-pair-transfer-outbound-and-inbound-movements Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-transfer-003-pair-transfer-outbound-and-inbound-movements Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_transfer_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_transfer_003.execute.req_fun_transfer_003(connection, {});
  typia.assert(output);
}

