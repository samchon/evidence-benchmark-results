import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Contract-level proving test for the generated operation.
 *
 * @evidence {@link api.functional.health.get} Exercises the generated operation simulator,
 * which validates its published request and response contract.
 */
export async function test_api_contract_health_get(connection: api.IConnection): Promise<void> {
  const operation = api.functional.health.get;
  const simulated = { ...connection, simulate: true } as Parameters<typeof operation>[0];
  await operation(simulated);
}

