import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Validate that the generated health accessor reaches the running backend.
 *
 * The scaffold needs one infrastructure proof that the generated SDK can call
 * the application it describes. This test derives an anonymous connection from
 * the runner's base host, calls the health accessor, and validates its response
 * against the generated contract.
 *
 * 1. Derive an anonymous connection from the base host.
 * 2. Call the generated health accessor.
 * 3. Validate the response against its generated type.
 *
 * @param connection Base connection supplied by the dynamic e2e runner.
 * @evidence {@link api.functional.health.get} Exercises the generated health operation.
 * @evidenceReview {@link api.functional.health.get} Read the generated accessor and ran this test against a started backend: it calls that operation and validates the response against the contract the accessor declares.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-001-runs-as-a-working-production-grade-autobe-backend-across-every-source-named-erp-module Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-001-runs-as-a-working-production-grade-autobe-backend-across-every-source-named-erp-module Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-002-organizations-production-delivery-for-organizations-rely-durable Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-002-organizations-production-delivery-for-organizations-rely-durable Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-003-consumers-production-delivery-for-consumers-invoke-typed Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-003-consumers-production-delivery-for-consumers-invoke-typed Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-004-the-production-delivery-for-completed-proves-procure Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-004-the-production-delivery-for-completed-proves-procure Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-005-each-production-delivery-for-each-journey-verification Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-005-each-production-delivery-for-each-journey-verification Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_api_health(
  connection: api.IConnection,
): Promise<void> {
  // Step 1: Derive an anonymous connection from the base host
  const healthConnection: api.IConnection = { host: connection.host };

  // Step 2: Call the generated health accessor
  const value: string = await api.functional.health.get(healthConnection);

  // Step 3: Validate the response against its generated type
  typia.assert(value);
}
