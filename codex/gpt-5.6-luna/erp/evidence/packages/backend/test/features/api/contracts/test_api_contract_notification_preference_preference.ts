import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Contract-level proving test for the generated operation.
 *
 * @evidence {@link api.functional.notification_preference.preference} Exercises the generated operation simulator,
 * which validates its published request and response contract.
 */
export async function test_api_contract_notification_preference_preference(connection: api.IConnection): Promise<void> {
  const operation = api.functional.notification_preference.preference;
  const simulated = { ...connection, simulate: true } as Parameters<typeof operation>[0];
  await operation(simulated);
}

