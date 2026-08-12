import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorize, image } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an invalid continuation visibly starts a fresh first page.
 *
 * 1. Create the actors and prerequisite records used by test_api_pagination_invalid_continuation.
 * 2. Execute test_api_pagination_invalid_continuation's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_pagination_invalid_continuation(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_pagination_invalid_continuation.
  // Step 2: Execute test_api_pagination_invalid_continuation's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorize(connection.host);
  const name = `reset_${Date.now().toString(36)}`;
  const community = await api.functional.communities.createCommunity(account, { name, description: "Reset page item", icon: image() });
  typia.assert(community);
  const reset = await api.functional.communities.communities({ host: connection.host }, { limit: 1, search: name, continuation: "invalid" });
  typia.assert(reset);
  requireValue(reset.pagination.current === 1 && reset.pagination.reset === true && reset.data.some((item) => item.id === community.id), "Invalid continuation did not reset the scoped traversal.");
  const feed = await api.functional.feed.popular.popularFeed({ host: connection.host }, { page: 2, limit: 1, sort: "new", continuation: "invalid" });
  typia.assert(feed);
  requireValue(feed.pagination.current === 1 && feed.pagination.reset === true, "Invalid feed continuation honored a supplied non-first page.");
}



