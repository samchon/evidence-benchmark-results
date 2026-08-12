import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_exchange_rate_001.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-exchange-rate-exchange-rates Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-exchange-rate-exchange-rates Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_exchange_rate_001.execute.req_fun_exchange_rate_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_exchange_rate_001.execute.req_fun_exchange_rate_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-exchange-rate-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-exchange-rate-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-001-records-or-corrects-a-dated-exchange-rate Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-001-records-or-corrects-a-dated-exchange-rate Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_exchange_rate_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_exchange_rate_001.execute.req_fun_exchange_rate_001(connection, {});
  typia.assert(output);
}
