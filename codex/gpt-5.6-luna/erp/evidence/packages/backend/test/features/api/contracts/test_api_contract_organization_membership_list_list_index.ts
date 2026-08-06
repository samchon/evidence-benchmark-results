import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Contract-level proving test for the generated operation.
 *
 * @evidence {@link api.functional.organization_membership_list.list.index} Exercises the generated operation simulator,
 * which validates its published request and response contract.
 */
export async function test_api_contract_organization_membership_list_list_index(connection: api.IConnection): Promise<void> {
  const operation = api.functional.organization_membership_list.list.index;
  const simulated = { ...connection, simulate: true } as Parameters<typeof operation>[0];
  await operation(simulated);
}

