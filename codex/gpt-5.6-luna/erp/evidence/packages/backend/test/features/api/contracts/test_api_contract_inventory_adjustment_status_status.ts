import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Contract-level proving test for the generated operation.
 *
 * @evidence {@link api.functional.inventory_adjustment_status.status} Exercises the generated operation simulator,
 * which validates its published request and response contract.
 */
export async function test_api_contract_inventory_adjustment_status_status(connection: api.IConnection): Promise<void> {
  const operation = api.functional.inventory_adjustment_status.status;
  const simulated = { ...connection, simulate: true } as Parameters<typeof operation>[0];
  await operation(simulated, typia.random<Parameters<typeof operation>[1]>(), typia.random<Parameters<typeof operation>[2]>());
}

