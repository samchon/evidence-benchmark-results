import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorize, image } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a valid continuation advances and an invalid one visibly resets.
 *
 * 1. Create the actors and prerequisite records used by test_api_pagination_valid_continuation.
 * 2. Execute test_api_pagination_valid_continuation's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_pagination_valid_continuation(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_pagination_valid_continuation.
  // Step 2: Execute test_api_pagination_valid_continuation's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorize(connection.host);
  const prefix = `page_${Date.now().toString(36)}`;
  const firstCommunity = await api.functional.communities.createCommunity(account, { name: `${prefix}_a`, description: "First page item", icon: image() });
  typia.assert(firstCommunity);
  const secondCommunity = await api.functional.communities.createCommunity(account, { name: `${prefix}_b`, description: "Second page item", icon: image() });
  typia.assert(secondCommunity);
  const first = await api.functional.communities.communities({ host: connection.host }, { limit: 1, search: prefix });
  typia.assert(first);
  requireValue(first.data.some((community) => community.id === firstCommunity.id) && first.pagination.continuation !== null, "The scoped first page did not establish a continuation.");
  const next = await api.functional.communities.communities({ host: connection.host }, { search: prefix, continuation: first.pagination.continuation });
  typia.assert(next);
  requireValue(next.pagination.current === 2 && next.pagination.reset !== true && next.data.some((community) => community.id === secondCommunity.id), "Valid continuation did not preserve the scoped second page.");
}




